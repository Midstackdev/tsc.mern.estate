import { Request } from "express";
import { IUser } from "../DbSchema/user";
import { Encrypter } from "../Utils/Hash";
import { cache } from "../libs/cache/redis";
import { throwHttpError } from "../libs/utils/errors";

export class OtpService {
  private generate() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private sign() {
    const data = this.generate();
    const signed = Encrypter.sign(data.toString());
    return {
      data,
      signed,
    };
  }

  private getKey(userId: string) {
    return `otp*user*${userId!.toString()}*key`;
  }

  private async store(signedData: string, userId: string) {
    const key = this.getKey(userId);
    const exists = await cache.get(key);
    if (exists) {
      return true;
    }
    const stored = await cache.set(key, signedData, 15 * 60);
    return true;
  }

  private async retrieve(userId: string) {
    const key = this.getKey(userId);
    const data = await cache.get(key);
    if (!data) {
      throwHttpError("otp expired");
    }
    return data;
  }

  private sendSmsNotification(code: number) {
    //send here
  }

  private sendEmailNotification(code: number) {
    // send here
  }

  public async send(req: Request) {
    const { id } = req.user;
    const { data, signed } = this.sign();

    await this.store(signed, id);

    // send otp to mail or sms based on user preference

    return data;
  }

  public async verify(req: Request) {
    const { id } = req.user;
    const { code } = req.body;
    const get = await this.retrieve(id);

    const verified = Encrypter.verify(code.toString(), get);
    console.log("---gh----", { id, get, verified });

    if (!verified) {
      throwHttpError("invalid code");
    }

    return verified;
  }
}

export const otpService = new OtpService();
