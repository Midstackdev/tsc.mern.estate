import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { TOTP_ISSUER, TOTP_LABEL } from "../config";
import { Base32 } from "../Utils/HiBase";
import { throwHttpError } from "../libs/utils/errors";

export class TwoFactorService {
  private generateRandomBase32() {
    const secret = Base32.generateRandom();
    return secret;
  }

  private totp(secret: string) {
    return new OTPAuth.TOTP({
      issuer: TOTP_ISSUER,
      label: TOTP_LABEL,
      algorithm: "SHA1",
      digits: 6,
      secret: secret!,
    });
  }

  private generateQRCodeURL(url: string) {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(url, (err, dataURL) => {
        if (err) {
          reject(err);
        } else {
          resolve(dataURL);
        }
      });
    });
  }

  private async generate() {
    const secret = this.generateRandomBase32();
    const token = this.totp(secret);
    const url = token.toString();
    const qrCodeUrl = await this.generateQRCodeURL(url);

    return { url, qrCodeUrl, secret };
  }

  private validate(secret: string, token: string, window?: boolean) {
    const delta = this.totp(secret).validate({
      token,
      ...(window && { window: 1 }),
    });

    if (delta === null) {
      throwHttpError("invalid code verification failed");
    }

    return true;
  }

  public verifies(token: string) {
    const secret = this.getUserSecret();
    const window = true;

    return this.validate(secret, token, window);
  }

  public verified(userId: string, token: string) {
    const secret = this.getUserSecret();

    const validated = this.validate(secret, token);

    // update user 2fa type to enable after validation

    return validated;
  }

  public async enables(userId: string) {
    // update user options based on chosen preference for totp
    // returns a genrated token
    const token = await this.generate();

    // update user 2fa type secret
    return token;
  }

  public disables(userId: string) {
    // update user options
    return true;
  }

  private getUserSecret() {
    // return "HBTDSNLEGI3TSNJXG44GMYZU";
    return "MYYGGZBZGEZTGNBXG4YGCY3G";
  }

  private updateUserSecret() {
    //update the user totp options
    return "HBTDSNLEGI3TSNJXG44GMYZU";
  }
}

export const twoFactorService = new TwoFactorService();
