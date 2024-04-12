import { Password } from "../Utils/Password";
import { Jwt } from "../Utils/Utils";
import { JWT_SECRET } from "../config";
import { Mailer } from "../libs/mail/mailer";
import { throwHttpError } from "../libs/utils/errors";
import { authService } from "./auth";

export class ResetsPasswordService {
  public createPasswordResetToken(data: Record<string, any>) {
    return Jwt.generateToken(data, JWT_SECRET, 15 * 60);
  }

  public createPasswordResetUrl(id: string, token: string) {
    return `${
      process.env.CLIENT_URL ?? "http://localhost:3000"
    }/password/reset/${id}/${token}`;
  }

  // refactor to cater for both mails
  // posible extraction to a class for the mail
  public async createPasswordResetEmail(
    email: string,
    data: Record<string, any>
  ) {
    try {
      return await Mailer.send(email, "Reset Password", "reset-password", data);
    } catch (error) {
      throwHttpError("Error sending mail");
    }
  }

  public async createResetPassword(email: string) {
    const user = await authService.userExists({ email });

    if (!user) {
      throwHttpError("user doesn't exists");
    }

    const token = this.createPasswordResetToken({
      id: user._id,
      email: user.email,
      createdAt: Date.now(),
    });

    const link = this.createPasswordResetUrl(user._id, token);

    await this.createPasswordResetEmail(user.email, { name: user.name, link });

    return true;
  }

  public async updatePassword({ id, token, password }: Record<string, string>) {
    const user = await authService.userExists({ _id: id });

    if (!user) {
      throwHttpError("user doesn't exists");
    }

    const validToken = Jwt.verifyToken(token, JWT_SECRET);

    user.password = await Password.hash(password);
    await user.save();

    await Mailer.send(
      user.email,
      "Password Reset Successful",
      "reset-password-confirmation",
      { name: user.name }
    );

    return user;
  }
}

export const passwordResetService = new ResetsPasswordService();
