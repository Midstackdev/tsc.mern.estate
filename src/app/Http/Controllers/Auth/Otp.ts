import { NextFunction, Request, Response } from "express";
import Controller from "../../../libs/routing/Controller";
import { otpService } from "../../../Services/otp";

export class OtpController extends Controller {
  public constructor() {
    super();
  }

  public async sendCode(req: Request, res: Response, next: NextFunction) {
    try {
      const code = await otpService.send(req);

      console.log("---otp--", code);
      return super.jsonRes(
        {
          type: "success",
          message: "Otp code sent successfully!",
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  public async verifyCode(req: Request, res: Response, next: NextFunction) {
    try {
      const verified = await otpService.verify(req);
      return super.jsonRes(
        {
          message: "Otp verified successfully!",
          type: "success",
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }
}
