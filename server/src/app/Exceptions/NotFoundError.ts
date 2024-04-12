import HttpStatusCode from "../Enums/HttpStatusCode";
import BaseError from "../libs/exceptions/BaseError";

export default class NotFoundError extends BaseError {
  constructor(message = "Not found") {
    super(message, HttpStatusCode.NOT_FOUND, true);
  }
}
