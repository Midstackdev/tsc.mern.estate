import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import {
  MAIL_FROM_ADDRESS,
  MAIL_HOST,
  MAIL_MAILER,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USERNAME,
} from "../../config";
export class Mail {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      service: MAIL_MAILER,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });
  }

  public async send(
    to: string,
    subject: string,
    fileName?: string,
    data?: object,
    text?: string
  ) {
    const mailOptions = {
      from: MAIL_FROM_ADDRESS,
      to,
      subject,
      ...(text && { text }),
      ...(fileName && { html: await this.render(fileName as string, data) }),
      attachments: [],
    };
    const result = await this.transporter.sendMail(mailOptions);
    return result;
  }

  private async render(
    emailPathName: string,
    replacements: object = {}
  ): Promise<string> {
    const filePath = path.join(
      __dirname,
      `./resources/views/html/${emailPathName}.ejs`
    );
    // const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = await ejs.renderFile(filePath, replacements);
    return template;
  }

  public static sendMail({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }) {
    return new this().send(to, subject, "", {}, text);
  }
}

export const Mailer = new Mail();
