import { NextFunction, Request, Response } from "express";
import Controller from "../../../libs/routing/Controller";
import { authService } from "../../../Services/auth";
import { Jwt } from "../../../Utils/Utils";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../../../config";
import { Http } from "../../../libs/client/Http";
import { IUser } from "../../../DbSchema/user";
import { Password } from "../../../Utils/Password";

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
            id: user._id,
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

  public async SignInWith(req: Request, res: Response, next: NextFunction) {
    try {
      const googleApiUrl = "https://accounts.google.com/o";
      const url = `${googleApiUrl}/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
      return super.jsonRes(
        {
          url,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  public async SignInWithCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { code } = req.query;

    const params = {
      code: code as string,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    };
    // const queryString = new URLSearchParams(params).toString();

    try {
      // Exchange authorization code for access token
      const data = await Http.post(
        "https://oauth2.googleapis.com/token",
        {
          "Content-Type": "application/json",
        },
        {},
        {
          ...params,
        }
      );

      const { access_token, id_token } = data;

      // Use access_token or id_token to fetch user profile
      const userData = await Http.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        { Authorization: `Bearer ${access_token}` },
        {}
      );

      // Code to handle user authentication and retrieval using the profile data
      let user;
      user = await authService.userExists({ email: userData.email });
      if (!user) {
        const data = {
          name:
            userData.name ?? `${userData.given_name} ${userData.family_name}`,
          email: userData.email,
          emailVerifiedAt: new Date(),
          password: Password.generate(),
        };

        user = await authService.register(data as IUser);
        //send message to reset password
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
          user: userData,
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
}
