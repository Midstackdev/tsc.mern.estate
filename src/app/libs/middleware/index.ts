import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { log } from "../logger";

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  /** Log the Request */
  log.primary(
    `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    /** Log the Request */
    log.success(
      `Outgoing -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
    );
  });

  next();
};

export const cors = (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allowed-Origin", "*");
  res.header(
    "Access-Control-Allowed-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header(
      "Access-Control-Allowed-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );
    return res.status(200).json({});
  }
  next();
};

export const notFoundRoute = (_req: Request, res: Response) => {
  res.status(404).json({
    message: "Not found!, read the API documentation to find your way",
  });
};

export const addReqId = (req: Request, _res: Response, next: NextFunction) => {
  req.reqId = req.header("id") || uuidv4();
  next();
};

// const setCors = (req: Request, res: Response, next: NextFunction) => {
//   // cors();
//   res.set("Cache-Control", "no-store, max-age=0");
//   next();
// };
