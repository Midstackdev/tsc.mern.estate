import { FormRequest } from "./FormRequests";

export default function validate(data: any, validationRule: any) {
  return new FormRequest(data, validationRule);
}
