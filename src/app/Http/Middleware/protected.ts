import { NextFunction, Request, Response } from "express";
import { throwCustomError, throwHttpError } from "../../libs/utils/errors";
import { ACCESS_TOKEN_SECRET } from "../../config";
import { Jwt } from "../../Utils/Utils";
import { JwtPayload } from "../../interfaces";
import { User } from "../../Models/User";
import HttpStatusCode from "../../Enums/HttpStatusCode";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    throwCustomError({
      message: "No token!",
      status: HttpStatusCode.UNAUTHORIZED,
    });
  }

  const token = authorization!.split(" ")[1];

  const data = Jwt.verifyToken(token, ACCESS_TOKEN_SECRET) as JwtPayload;

  //   if (!data) {
  //     throwCustomError({
  //       message: "Invalid refresh token!",
  //       status: HttpStatusCode.UNAUTHORIZED,
  //     });
  //   }
  //   const user = User.findById(data.id);

  //   if (!user) {
  //     throwNotFoundError("User doesn't exist!");
  //   }

  req.user = data;
  // call the next middleware
  next();
};
