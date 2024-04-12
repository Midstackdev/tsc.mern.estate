import BaseError from "../libs/exceptions/BaseError";

class ErrorHandler {
  async handleError(err: Error) {
    // await logger.error(
    //   "Error message from the centralized error-handling component",
    //   err
    // );
    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
export const errorHandler = new ErrorHandler();
