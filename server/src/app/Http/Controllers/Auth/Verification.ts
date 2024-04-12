import { NextFunction, Request, Response } from "express";
import Controller from "../../../libs/routing/Controller";
import { verifiesEmailService } from "../../../Services/verifiesEmail";
import { throwCustomError } from "../../../libs/utils/errors";

export class VerificationController extends Controller {
  public constructor() {
    super();
  }

  public async resend(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email ?? req.query.email;

      const sent = await verifiesEmailService.sendVerificationNotification({
        email,
      });

      console.log("====sent===", sent);
      return super.jsonRes(
        {
          message: "Email verification link has been sent to your mail!",
          type: "success",
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, hash } = req.params;
      const { expires, signature } = req.query;

      const verified = await verifiesEmailService.verifyEmail({
        id,
        hash,
        expires,
        signature,
        req,
      });
      console.log("====verified===", verified);

      return super.jsonRes(
        {
          message: "Email verified!",
          type: "success",
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }
}
