import { NextFunction, Request, Response } from "express";
import Controller from "../../../libs/routing/Controller";
import { passwordResetService } from "../../../Services/resetsPassword";

export class ResetPasswordController extends Controller {
  public constructor() {
    super();
  }

  public sendResetLinkForm(req: Request, res: Response, next: NextFunction) {
    return super.jsonRes({}, res);
  }

  public async sendResetLinkEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      super.validate(req.body, {
        email: "required|email",
      });

      const mailed = await passwordResetService.createResetPassword(
        req.body.email
      );
      console.log("====mailer===", mailed);
      return super.jsonRes(
        {
          message: "Password reset link has been sent to your email!",
          type: "success",
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  public async reset(req: Request, res: Response, next: NextFunction) {
    try {
      super.validate(req.body, {
        token: "required",
        id: "required",
        password: "required|confirmed",
      });

      const updated = await passwordResetService.updatePassword(req.body);
      console.log("====updated===", updated);
      // possibly login the user right after reset
      return super.jsonRes(
        {
          message: "Email sent!",
          type: "success",
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }
}
