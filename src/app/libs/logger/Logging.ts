import chalk from "chalk";

export default class Logging {
  public static log = (args: any) => this.info(args);
  public static info = (args: any) =>
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.blueBright(args) : args
    );
  public static warn = (args: any) =>
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.yellowBright(args) : args
    );
  public static error = (args: any) =>
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [ERROR]`),
      typeof args === "string" ? chalk.redBright(args) : args
    );
  public static success = (args: any) =>
    console.log(
      chalk.green(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.greenBright(args) : args
    );
  public static primary = (args: any) =>
    console.log(
      chalk.gray(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.gray(args) : args
    );

  private formatDate = (date: Date) => {
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map((n) => n.toString().padStart(2, "0"))
      .join(":");
  };
}
