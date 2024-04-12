export interface SMSInterface {
  register: (to: string) => any;
  verify: (to: string, code: string) => any;
  send: (phoneNumber: string, message: string) => any;
}
