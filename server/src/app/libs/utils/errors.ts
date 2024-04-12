import NotFoundError from "../../Exceptions/NotFoundError";
import HttpError from "../../Exceptions/HttpError";
import CustomError from "../exceptions/CustomError";
import { AppError } from "../../types";

// handle errors with this method using the custom errors in your service
// throwHttpError(serviceErrors.unexpectedError);
export const throwHttpError = (message?: string) => {
  throw new HttpError(message);
};

export const throwNotFoundError = (message?: string) => {
  throw new NotFoundError(message);
};

export const throwCustomError = (error: {
  message: string;
  status: number;
  options?: any;
}) => {
  throw new CustomError(error);
};

// Add custom error hadling messages to obfuscate your errors to the user
// this can be passed in the catch to handle errors in our  controllers
const serviceErrors = {
  unexpectedError: {
    message: "Unexpected error occurred",
    statusCode: 500,
    errorCode: "SERVICE000",
  },
};

export default serviceErrors;
