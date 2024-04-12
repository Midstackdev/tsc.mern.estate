import { IUser, UserDoc } from "../DbSchema/user";
import HttpStatusCode from "../Enums/HttpStatusCode";
import { Encrypter } from "../Utils/Hash";
import { UrlGenerator } from "../Utils/Utils";
import { Mailer } from "../libs/mail/mailer";
import {
  throwCustomError,
  throwHttpError,
  throwNotFoundError,
} from "../libs/utils/errors";
import { authService } from "./auth";

export default class VerifiesEmailService {
  public verificationUrl(user: IUser) {
    const idHash = Encrypter.SHA1(user._id!.toString());
    const expires = Date.now() + 15 * 60 * 1000;
    const routeHash = `/email/resend/${user._id}/${idHash}`;
    const signature = UrlGenerator.signedRoute(
      routeHash,
      Encrypter.SHA1(user.email)
    );
    return `${process.env.CLIENT_URL ?? "http://localhost:3000"}/email/verify/${
      user._id
    }/${idHash}?expires=${expires}&signature=${signature}`;
  }

  public hasVerifiedEmail(user: IUser) {
    return !!user.emailVerifiedAt;
  }

  public async markEmailAsVerified(user: UserDoc) {
    user.emailVerifiedAt = new Date();
    await user.save();
  }

  public async sendVerificationEmail(user: IUser, data: Record<string, any>) {
    try {
      await Mailer.send(user.email, "Verify Email", "verify-email", {
        name: user.name,
        ...data,
      });
    } catch (error) {
      throwHttpError("Error sending mail");
    }
  }

  public async sendVerificationNotification({ email }: Record<string, string>) {
    const user = await authService.userExists({ email });

    if (!user) {
      throwNotFoundError("user doesn't exists");
    }

    // when email is chnaged we set verifiedAt to empty
    if (this.hasVerifiedEmail(user)) {
      throwHttpError("email veriied already");
    }

    const link = this.verificationUrl(user);

    await Mailer.send(user.email, "Verify Email", "verify-email", {
      name: user.name,
      link,
    });

    return true;
  }

  public async verifyEmail({
    id,
    hash,
    expires,
    signature,
    req,
  }: Record<string, any>) {
    const user = await authService.userExists({ _id: id });

    if (!user) {
      throwNotFoundError("user doesn't exists");
    }

    if (!Encrypter.hashEquals(hash, Encrypter.SHA1(user._id.toString()))) {
      throwCustomError({
        message: "Invalid User",
        status: HttpStatusCode.FORBIDDEN,
      });
    }
    if (
      !UrlGenerator.hasValidSignature({
        expires: +expires,
        signature,
        emailHash: Encrypter.SHA1(user.email),
        reqPath: req.url.split("?")[0],
      })
    ) {
      throwHttpError("Invalid Signature");
    }

    if (this.hasVerifiedEmail(user)) {
      return true;
    }

    await this.markEmailAsVerified(user);

    await Mailer.send(
      user.email,
      "Email Verified Successful",
      "verify-email-confirmation",
      {
        name: user.name,
      }
    );

    return true;
  }
}

export const verifiesEmailService = new VerifiesEmailService();
