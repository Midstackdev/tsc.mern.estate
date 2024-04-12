import { FormRequest } from "../../libs/validator/FormRequests";

export class RegisterFormRequest extends FormRequest {
  public validationRule = {
    phone: "required|digits:10",
    code: "required|digits:4",
  };

  public messages = {};
}
