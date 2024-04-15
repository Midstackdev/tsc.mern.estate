import { config } from "dotenv";

// if (process.env.NODE_ENV !== "production") {
config();
// }

// console.log("---ENV---", process.env);
export const __prod__ = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI || "";
export const MONGO_USER = process.env.MONGO_USER || "";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
export const MONGO_IP = process.env.MONGO_IP || "";
export const MONGO_PORT = process.env.MONGO_PORT || "";
export const MONGO_DATABASE = process.env.MONGO_DATABASE || "";
export const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 5000;
export const MONGO_URL = `mongodb://${MONGO_IP}:${MONGO_PORT}/${MONGO_DATABASE}`;
export const REDIS_PORT = process.env.REDIS_PORT
  ? Number(process.env.REDIS_PORT)
  : 6379;
export const REDIS_HOST = process.env.REDIS_HOST || "";
export const REDIS_URL = process.env.REDIS_URL || "";
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
export const MAIL_MAILER = process.env.MAIL_MAILER || "";
export const MAIL_HOST = process.env.MAIL_HOST || "";
export const MAIL_PORT = process.env.MAIL_PORT
  ? Number(process.env.MAIL_PORT)
  : 587;
export const MAIL_USERNAME = process.env.MAIL_USERNAME || "";
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || "";
export const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
export const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || "";
export const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID || "";
export const TOTP_LABEL = process.env.APP_NAME || "";
export const TOTP_ISSUER = process.env.TOTP_ISSUER || "";
export const CLIENT_ID = process.env.CLIENT_ID || "";
export const CLIENT_SECRET = process.env.CLIENT_SECRET || "";
export const REDIRECT_URI = process.env.REDIRECT_URI || "";
export const REDIRECT_URI_SERVER = process.env.REDIRECT_URI_SERVER || "";
