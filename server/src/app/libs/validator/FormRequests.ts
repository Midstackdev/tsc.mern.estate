import Validator from "validatorjs";
import ValidationError from "../exceptions/ValidationError";

export class FormRequest {
  public validation: any;
  constructor(
    public data: any,
    public validationRule: any,
    public messages?: any
  ) {
    this.validate();
  }

  /**
   * https://github.com/mikeerickson/validatorjs
   */
  public validate() {
    this.validation = new Validator(this.data, this.validationRule);

    this.passes();

    this.fails();
  }

  private passes() {
    if (this.validation.passes()) {
      return;
    }
  }

  private fails() {
    if (this.validation.fails()) {
      throw new ValidationError("Validation Error", this.validation.errors);
    }
  }
}
