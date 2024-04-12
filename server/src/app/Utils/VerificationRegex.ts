export class VerificationRegex {
  private emailRegex;
  private phoneRegex;
  constructor() {
    this.emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    this.phoneRegex = new RegExp(/^\+(?:[0-9] ?){6,14}[0-9]$/);
  }

  isValidEmail(email: string) {
    return this.emailRegex.test(email);
  }

  isValidPhone(phone: string) {
    return this.phoneRegex.test(phone);
  }

  //validate international phone number
  validatePhoneNumber(phoneNumber: string) {
    return this.phoneRegex.test(phoneNumber);
  }
}
