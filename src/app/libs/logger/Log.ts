import chalk from "chalk";
import { v4 as uuid } from "uuid";
import { NextFunction, Request, Response } from "express";
import { ILogConfig, ILogger } from ".";
import { File } from "../files/File";
import { rootPath } from "../utils/helpers";

export const logEvents = async (message: any, logName: string) => {
  const dateTime = `${new Date().toLocaleString()}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!File.exists(`${rootPath}/storage/logs`)) {
      await File.makeDir(`${rootPath}/storage/logs`);
    }

    await File.append(`${rootPath}/storage/logs/${logName}`, logItem);
  } catch (err) {
    console.log(err);
  }
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

export class Logger implements ILogger {
  public config: ILogConfig;
  private logTime: string;

  constructor(config: ILogConfig) {
    this.config = config;
    this.logTime = `[${new Date().toLocaleString()}]`;
  }

  isErrorObject(value: any) {
    return value && value instanceof Error;
  }

  getErrorExtraData(err: any) {
    // if err is not an object, it might be an string containing some useful information.
    if (!err || typeof err === "string") {
      return err;
    }
    // otherwise, err might be from axios library, so extract useful information from it:
    return {
      responseStatus: err?.response?.status,
      responseBody: err?.response?.data,
      url: err?.response?.config?.url,
      message: err?.message,
      statusCode: err?.statusCode,
      errors: err?.errors,
      code: err?.code,
    };
  }

  getErrorMessage(value: any) {
    const isErrorObject = this.isErrorObject(value);

    if (isErrorObject) {
      // console.log("----1----", value);
      return value?.message || value?.reason || value;
    }

    return value;
  }

  private log(message: any) {
    if (message) {
      console.log(message);
    }
  }

  info(args: any) {
    this.log(
      chalk.blue(`${this.logTime} [INFO] `) +
        chalk.blueBright(this.getErrorMessage(args))
    );
    // this.externalHandler(message);
  }

  warn(args: any) {
    this.log(
      chalk.yellow(`${this.logTime} [WARN] `) +
        chalk.yellowBright(this.getErrorMessage(args))
    );
    // this.externalHandler(message);
  }

  error(args: any) {
    this.log(
      chalk.red(`${this.logTime} [ERROR] `) +
        chalk.redBright(this.getErrorMessage(args))
    );
    // this.externalHandler(error);
  }

  debug(args: any) {
    this.log(
      chalk.cyan(`${this.logTime} [DEBUG] `) +
        chalk.cyanBright(this.getErrorMessage(args))
    );
    // this.externalHandler(error);
  }

  critical(args: any) {
    this.log(
      chalk.magenta(`${this.logTime} [CRITICAL] `) +
        chalk.magentaBright(this.getErrorMessage(args))
    );
    // this.externalHandler(error);
  }

  success(args: any) {
    this.log(
      chalk.green(`${this.logTime} [INFO] `) +
        chalk.whiteBright(this.getErrorMessage(args))
    );
    // this.externalHandler(message);
  }

  primary(args: any) {
    this.log(
      chalk.gray(`${this.logTime} [INFO] `) +
        chalk.whiteBright(this.getErrorMessage(args))
    );
    // this.externalHandler(message);
  }

  // externalHandler(message) {
  //   // NOTE: Implement calls to third-party logging services here.
  // }
}
