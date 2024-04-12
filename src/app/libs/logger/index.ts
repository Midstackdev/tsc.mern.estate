import { Request, Response } from "express";
import { Logger } from "./Log";

export interface ILogger {
  config: ILogConfig;
  critical: (options: ILogError) => any | void;
  error: (options: ILogError) => any | void;
  warn: (options: ILogError | ILogInfo) => any | void;
  info: (options: ILogInfo) => any | void;
  debug: (options: ILogInfo) => any | void;
}

export interface ILogConfig {
  projectName: string;
  version: string;
  setDebugMode?: boolean;
  note?: string;
  sqsEnabled?: boolean;
  consoleEnabled?: boolean;
  req?: ILogRequest;
  res?: ILogResponse;
}

export type ILogRequest = Request<any> & { [key: string]: any };
export type ILogResponse = Response<any> & { [key: string]: any };

type ILogBase = {
  // OPTIONAL
  // code?: IErrorCode;
  req?: ILogRequest;
  res?: ILogResponse;
  err?: Error | unknown;

  // CUSTOM | will override error information
  stacktrace?: string;
  httpStatus?: number;
  userMessage?: string;
  customMessage?: string;
  systemMessage?: string;
  // brandId?: string;
  // brand?: IGenericObject;
  //   userId?: string;
};

export type ILogInfo = ILogBase & {
  // REQUIRED
  customMessage: string;
};

// the interface used to get logs for logger.critical / logger.error / logger.warn
export type ILogError = ILogBase & {
  // REQUIRED
  code?: number;
  // code: IErrorCode;
};

export enum ILogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  CRITICAL = "critical",
}

const conf: ILogConfig = {
  projectName: process.env.npm_package_name || "",
  version: process.env.npm_package_version || "",
  note: `Logger feat instance ${Math.trunc(Math.random() * 10000)}`,
};

export const log = new Logger(conf);
