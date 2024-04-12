import { NextFunction, Request, Response } from "express";
import Controller from "../../../libs/routing/Controller";
import { twoFactorService } from "../../../Services/twoFactor";

export class TwoFactorController extends Controller {
  public constructor() {
    super();
  }

  public async enable(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await twoFactorService.enables(req.user.id);
      return super.jsonRes(
        {
          type: "success",
          ...token,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  public async verifies(req: Request, res: Response, next: NextFunction) {
    try {
      const verified = twoFactorService.verified(req.user.id, req.body.token);
      return super.jsonRes(
        {
          type: "success",
          verified,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  public async validates(req: Request, res: Response, next: NextFunction) {
    try {
      const verified = twoFactorService.verifies(req.body.token);
      return super.jsonRes(
        {
          type: "success",
          verified,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  public async disable(req: Request, res: Response, next: NextFunction) {
    try {
      const disabled = twoFactorService.disables(req.user.id);
      return super.jsonRes(
        {
          type: "success",
          disabled,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }
}
