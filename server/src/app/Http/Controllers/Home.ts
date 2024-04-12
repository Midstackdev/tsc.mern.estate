import { Request, Response } from "express";
import Controller from "../../libs/routing/Controller";

export class HomeController extends Controller {
  public constructor() {
    super();
  }

  public async index(req: Request, res: Response) {
    super.jsonRes(
      {
        message: "REST API HOME ROUTE IS HEALTHY",
        type: "success",
      },
      res
    );
  }
}
