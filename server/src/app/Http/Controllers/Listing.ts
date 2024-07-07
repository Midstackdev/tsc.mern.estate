import { NextFunction, Request, Response } from "express";
import Controller from "../../libs/routing/Controller";
import { Listing } from "../../Models/Listing";
import { throwCustomError, throwNotFoundError } from "../../libs/utils/errors";
import { IListing, ListingDoc } from "../../DbSchema/listng";
import { ImageUrl } from "../../types";
import { cloudinary } from "../../Integrations/Storage/cloudinary";

export class ListingController extends Controller {
  public constructor() {
    super();
  }

  public async index(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = parseInt(req.query.start as string) || 0;
      const search = req.query.term || "";
      const sort = (req.query.sort as string) || "createdAt";
      const order = req.query.order || "desc";

      let offer = req.query.offer;
      if (offer === undefined || offer === "false") {
        //@ts-ignore
        offer = {
          $in: [false, true],
        };
      }

      let furnished = req.query.furnished;
      if (furnished === undefined || furnished === "false") {
        //@ts-ignore
        furnished = {
          $in: [false, true],
        };
      }

      let parking = req.query.parking;
      if (parking === undefined || parking === "false") {
        //@ts-ignore
        parking = {
          $in: [false, true],
        };
      }

      let type = req.query.type;
      if (type === undefined || type === "all") {
        type = {
          $in: ["sale", "rent"],
        };
      }

      const query = {
        name: { $regex: search, $options: "i" },
        offer,
        furnished,
        parking,
        type,
      };

      // console.log("---qee---", query);

      const listings = await Listing.all({
        query,
        sort: { [sort]: order },
        limit,
        skip,
      });
      return super.jsonRes(listings, res);
    } catch (error) {
      next(error);
    }
  }

  public async show(req: Request, res: Response, next: NextFunction) {
    try {
      //validate admin
      const listing: ListingDoc = await Listing.findById(req.params.id, {
        path: "userRef",
        model: "User",
        select: "_id email name",
      });
      if (!listing) {
        throwNotFoundError("Listing not found");
      }
      return super.jsonRes(listing, res);
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

  public async remove(req: Request, res: Response, next: NextFunction) {
    try {
      //validate fields
      const listing: ListingDoc = await Listing.findById(req.params.id);
      if (!listing) {
        throwNotFoundError("Listing not found");
      }

      if (req.user.id !== listing.userRef) {
        throwCustomError({ message: "Not Authorized", status: 401 });
      }

      await ListingController.deleteImages(listing);
      await Listing.deleteById(req.params.id);
      return super.jsonRes("listing deleted", res);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      //validate fields
      const listing: ListingDoc = await Listing.findById(req.params.id);
      if (!listing) {
        throwNotFoundError("Listing not found");
      }

      if (req.user.id !== listing.userRef) {
        throwCustomError({ message: "Not Authorized", status: 401 });
      }

      const updatedDoc = await Listing.updateById(req.params.id, req.body);
      return super.jsonRes(updatedDoc, res);
    } catch (error) {
      next(error);
    }
  }

  public async removeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cloudinary.destroy(req.params.id);
      console.log("deleted result", result);
      return super.jsonRes("image deleted", res);
    } catch (error) {
      next(error);
    }
  }

  private static async deleteImages(listing: IListing) {
    const getPublicId = listing.imageUrls.map((list: ImageUrl) => {
      if (typeof list === "string") {
        const url = new URL(list).pathname.split("/").pop();
        const publicId = url?.split(".")[0];
        return publicId;
      }
      return list.publicId;
    });
    console.log("its a string ", getPublicId);

    getPublicId.map(async (id) => {
      const result = await cloudinary.destroy(id as string);
      console.log("deleted result", result);
    });
  }
}

export const controller: ListingController = new ListingController();
