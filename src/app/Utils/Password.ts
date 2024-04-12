import bcrypt from "bcrypt";

export class Password {
  public static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  public static async compare(plain: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(plain, hash);

    return match;
  }

  public static generate() {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&(){}[]?";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }
}
