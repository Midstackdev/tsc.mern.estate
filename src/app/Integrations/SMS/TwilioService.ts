import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
  TWILIO_SERVICE_SID,
} from "../../config";
import { throwCustomError } from "../../libs/utils/errors";
import { SMSInterface } from "./SMSInterface";
import client, { Twilio } from "twilio";

export class TwilioService implements SMSInterface {
  private client: Twilio;

  constructor() {
    this.client = client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  public async register(to: string) {
    try {
      const verification = await this.client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verifications.create({
          to,
          channel: "sms",
        });
      return verification;
    } catch (error) {
      throwCustomError({
        message: "Twilio register failed",
        status: 400,
        options: error,
      });
    }
  }

  public async verify(to: string, code: string) {
    try {
      const status = await this.client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
          to,
          code,
        });
      return status;
    } catch (error) {
      throwCustomError({
        message: "Twilio verification failed",
        status: 400,
        options: error,
      });
    }
  }

  public async send(phoneNumber: string, message: string) {
    try {
      const status = await this.client.messages.create({
        body: message,
        to: phoneNumber,
        from: TWILIO_FROM_NUMBER,
      });
      return status;
    } catch (error) {
      throwCustomError({
        message: "Twilio send sms failed",
        status: 400,
        options: error,
      });
    }
  }
}
