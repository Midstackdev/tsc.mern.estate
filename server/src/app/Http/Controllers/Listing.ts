import { NextFunction, Request, Response } from "express";
import Controller from "../../libs/routing/Controller";
import { Listing } from "../../Models/Listing";

export class ListingController extends Controller {
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

  public async store(req: Request, res: Response, next: NextFunction) {
    try {
      //validate fields
      const listing = Listing.create(req.body);
      super.jsonRes(listing, res);
    } catch (error) {
      next(error);
    }
  }
}

export const controller: ListingController = new ListingController();
