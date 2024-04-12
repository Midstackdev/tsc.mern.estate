import { IUser, UserDoc } from "../DbSchema/user";
import { User } from "../Models/User";
import { Password } from "../Utils/Password";
import { throwHttpError } from "../libs/utils/errors";

export class AuthService {
  public async register(data: IUser): Promise<IUser> {
    if (await this.userExists({ email: data.email })) {
      throwHttpError("email already exists");
    }
    const hashedPassword = await Password.hash(data.password);
    return User.create({ ...data, password: hashedPassword });
  }

  public userExists(query: Record<any, any>): Promise<UserDoc> {
    return User.findOne({ ...query });
  }

  public async attempt(email: string, password: string) {
    const user = await this.userExists({ email });
    if (!user) {
      throwHttpError("user doesn't exists");
    }

    const passwordMatches = await Password.compare(password, user.password);
    if (!passwordMatches) {
      throwHttpError("incorrect password");
    }
    return user;
  }
}

export const authService = new AuthService();
