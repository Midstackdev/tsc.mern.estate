import { NextFunction, Request, Response } from "express";
import Controller from "../../../libs/routing/Controller";
import { throwHttpError, throwNotFoundError } from "../../../libs/utils/errors";
import { Jwt } from "../../../Utils/Utils";
import { REFRESH_TOKEN_SECRET } from "../../../config";
import { User } from "../../../Models/User";
import { JwtPayload } from "../../../interfaces";
import { UserDoc } from "../../../DbSchema/user";

export class LogoutController extends Controller {
  public constructor() {
    super();
  }

  public async SignOut(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("refreshtoken");
      return super.jsonRes(
        {
          message: "Logged out successfully! 🤗",
          type: "success",
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  public async Refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshtoken } = req.cookies;
      if (!refreshtoken) {
        throwHttpError("No refresh token!");
      }
      const data = Jwt.verifyToken(
        refreshtoken,
        REFRESH_TOKEN_SECRET
      ) as JwtPayload;
      if (!data) {
        throwHttpError("Invalid refresh token!");
      }
      const user: UserDoc = await User.findById(data.id);

      if (!user) {
        throwHttpError("Invalid refresh token!");
      }

      if (user.refreshToken !== refreshtoken) {
        throwHttpError("Invalid refresh token!");
      }

      const refreshToken = Jwt.createRefreshToken({
        id: user._id,
      });

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
      });

      return super.jsonRes(
        {
          type: "success",
          message: "Refreshed successfully!",
          accessToken: Jwt.createAccessToken({
            id: user._id,
            email: user.email,
            name: user.name,
          }),
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }
}
