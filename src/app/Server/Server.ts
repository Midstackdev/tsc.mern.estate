import express, { Express } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { PORT } from "../config";
import { routes } from "../routes";
import { addReqId, cors, logRequest, notFoundRoute } from "../libs/middleware";
import connectDB from "../config/database";
import { log } from "../libs/logger";
import { errorMiddleware } from "../libs/middleware/errorHandler";

export class Server {
  private app: Express;

  constructor() {
    this.app = express();
    connectDB();
    this.configuration();
    this.middlewares();
    this.routes();
  }

  private configuration() {
    this.app.set("port", PORT || 3000);
  }

  /**
   * Enable express to serve up static assets
   */
  //   private assets(path: string) {
  //     this.app.use(express.static(path));
  //   }

  private middlewares() {
    this.app.use(logRequest);
    this.app.use(addReqId);
    this.app.use(cors);
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private routes() {
    this.app.use(routes);
    this.app.use(errorMiddleware);
    this.app.use(notFoundRoute);
  }

  startServer() {
    http.createServer(this.app).listen(this.app.get("port"), () => {
      log.info(`Server is listening on port ${this.app.get("port")}`);
    });
  }
}
