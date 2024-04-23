import { NextFunction, Request, Response } from "express";
import Controller from "../../libs/routing/Controller";
import { Listing } from "../../Models/Listing";
import { throwNotFoundError } from "../../libs/utils/errors";

export class ListingController extends Controller {
  public constructor() {
    super();
  }

  public async index(req: Request, res: Response, next: NextFunction) {
    try {
      //validate admin
      const listings = await Listing.findMany({});
      return super.jsonRes(listings, res);
    } catch (error) {
      next(error);
    }
  }

  public async store(req: Request, res: Response, next: NextFunction) {
    try {
      //validate fields
      const listing = await Listing.create(req.body);
      return super.jsonRes(listing, res);
    } catch (error) {
      next(error);
    }
  }

  public async userListings(req: Request, res: Response, next: NextFunction) {
    try {
      //validate authorized user
      if (req.user.id !== req.params.id) {
        throwNotFoundError("User not found");
      }
      const listings = await Listing.findMany({ userRef: req.user.id });
      return super.jsonRes(listings, res);
    } catch (error) {
      next(error);
    }
  }
}

export const controller: ListingController = new ListingController();
