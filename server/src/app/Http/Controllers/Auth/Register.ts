import { NextFunction, Request, Response } from "express";
import Controller from "../../../libs/routing/Controller";
import { authService } from "../../../Services/auth";
import { Jwt } from "../../../Utils/Utils";

export class RegisterController extends Controller {
  public constructor() {
    super();
  }

  public async SignUp(req: Request, res: Response, next: NextFunction) {
    try {
      super.validate(req.body, {
        name: "required|string",
        email: "required|email",
        password: "required|confirmed",
      });

      const user = await authService.register(req.body);
      // posibbly login user if verification not needed
      // or send messsage to verify if needed
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
