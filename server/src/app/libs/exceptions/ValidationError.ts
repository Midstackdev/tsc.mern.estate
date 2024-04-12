import HttpStatusCode from "../../Enums/HttpStatusCode";
import BaseError from "./BaseError";

export default class ValidationError extends BaseError {
  public options?: any;

  constructor(message = "Validation Failed", options: any) {
    super(message, HttpStatusCode.PRECONDITION_FAILED, true);
    this.options = options;
  }
}
