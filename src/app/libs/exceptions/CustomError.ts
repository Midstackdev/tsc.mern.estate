import { AppError } from "../../types";
import BaseError from "./BaseError";

export default class CustomError extends BaseError {
  public message: string;
  public status: number;
  public options?: any;

  constructor(
    error: Required<Pick<AppError, "message" | "status">> & AppError
  ) {
    super(error.message, error.status, true);
    this.message = error.message;
    this.status = error.status;
    this.options = error.options;
  }
}
