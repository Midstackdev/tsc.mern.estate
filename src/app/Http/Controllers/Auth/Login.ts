import { NextFunction, Request, Response } from "express";
import Controller from "../../../libs/routing/Controller";
import { authService } from "../../../Services/auth";
import { Jwt } from "../../../Utils/Utils";

export class LoginController extends Controller {
  public constructor() {
    super();
  }

  public async SignIn(req: Request, res: Response, next: NextFunction) {
    try {
      super.validate(req.body, {
        email: "required|email",
        password: "required|string",
      });

      const user = await authService.attempt(req.body.email, req.body.password);
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
          user: {
            email: user.email,
            name: user.name,
          },
          accessToken: Jwt.createAccessToken({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user?.role,
          }),
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * This route has to protected with role and auth middlewares
   * @param req
   * @param res
   * @param next
   */
  public async SignInAs(req: Request, res: Response, next: NextFunction) {
    try {
      super.validate(req.body, {
        email: "required|email",
      });
      const { email } = req.body;

      const user = await authService.userExists(email);
      // handle error if user not found
      return super.jsonRes(
        {
          user: {
            email: user.email,
            name: user.name,
          },
          // token: Jwt.generateToken(user),
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }
}
