export default class BaseError extends Error {
  public name: string;
  constructor(
    public message: string,
    public status: number,
    public isOperational?: boolean
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.status = status;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
