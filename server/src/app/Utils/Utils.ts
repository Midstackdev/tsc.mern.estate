import HttpStatusCode from "../Enums/HttpStatusCode";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config";
import { throwCustomError } from "../libs/utils/errors";
import { stringInfo } from "../types";
import * as jwt from "jsonwebtoken";
import { Encrypter } from "./Hash";

export class Utils {
  public static toUpperCase(arg: string) {
    return arg.toUpperCase();
  }

  public static getStringInfo(arg: string): stringInfo {
    return {
      lowerCase: arg.toLocaleLowerCase(),
      upperCase: arg.toLocaleUpperCase(),
      characters: Array.from(arg),
      length: arg.length,
      extraInfo: {},
    };
  }

  public static isUuid(uuid: string) {
    return uuid.match(
      "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    );
  }
}

export class StringUtils {
  public toUpperCase(arg: string) {
    if (!arg) {
      throw new Error("Invalid argument!");
    }
    return arg.toUpperCase();
  }
}

export class Jwt {
  public static generateToken(
    data: string | object | Buffer,
    secret: string,
    ttl?: string | number
  ) {
    return jwt.sign(data, secret, { expiresIn: ttl ?? "6h" });
  }

  public static verifyToken(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throwCustomError({
        message: "Invalid token!",
        status: HttpStatusCode.UNAUTHORIZED,
      });
    }
  }

  public static createAccessToken(data: any) {
    return this.generateToken(data, ACCESS_TOKEN_SECRET, 60 * 60);
  }

  public static createRefreshToken(data: any) {
    return this.generateToken(data, REFRESH_TOKEN_SECRET, "90d");
  }
}

export class UrlGenerator {
  public static signatureHasNotExpired(expires: number) {
    return !(expires && Date.now() > expires);
  }

  public static hasCorrectSignature(
    reqPath: string,
    signature: string,
    emailHash: string
  ) {
    return Encrypter.hashEquals(
      signature,
      Encrypter.SHA256(`${reqPath}${emailHash}`)
    );
  }

  public static hasValidSignature({
    expires,
    signature,
    emailHash,
    reqPath,
  }: Record<string, any>) {
    return (
      this.signatureHasNotExpired(expires) &&
      this.hasCorrectSignature(reqPath, signature, emailHash)
    );
  }

  public static signedRoute(routeHash: string, emailHash: string) {
    return Encrypter.SHA256(`${routeHash}${emailHash}`);
  }
}
