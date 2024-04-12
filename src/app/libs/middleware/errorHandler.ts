import { NextFunction, Request, Response } from "express";
import { logEvents } from "../logger/Log";
import { log } from "../logger";
import ValidationError from "../exceptions/ValidationError";
import { errorHandler } from "../../Exceptions/Handler";

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (typeof error === "string") {
    error = new Error(error);
  }
  // if (!error) {
  //   error = new Error("An error occured");
  // }
  const type = "error";
  const status = error.statusCode || error.status || 500;
  const message = error.message || "Whoops!! something went wrong";
  // const stack = process.env.NODE_ENV === "development" ? error.stack : {};

  if (error instanceof ValidationError) {
    return res.status(status).send({
      type: "error",
      message,
      ...error.options,
    });
  }

  if (!errorHandler.isTrustedError(error)) {
    next(error);
  }

  log.error(error);
  logEvents(`${error.name}: ${error.message}`, "errLog.txt");
  res.status(status).json({ type, message });
};
