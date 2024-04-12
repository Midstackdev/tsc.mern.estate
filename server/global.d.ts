import { Logger as Log } from "./src/app/libs/logger/Log";

declare global {
  type Logger = Log;
}
