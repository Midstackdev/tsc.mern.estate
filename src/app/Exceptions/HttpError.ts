import HttpStatusCode from "../Enums/HttpStatusCode";
import BaseError from "../libs/exceptions/BaseError";

export default class HttpError extends BaseError {
  constructor(message = "Bad request") {
    super(message, HttpStatusCode.BAD_REQUEST, true);
  }
}
