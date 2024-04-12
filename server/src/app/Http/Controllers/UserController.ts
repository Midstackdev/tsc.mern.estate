import { NextFunction, Request, Response } from "express";
import Controller from "../../libs/routing/Controller";
import { User } from "../../Models/User";
import { log } from "../../libs/logger";
import { cache } from "../../libs/cache/redis";
import { cloudinary } from "../../Integrations/Storage/cloudinary";
import { UserResource } from "../Resource/UserResource";

export class UserController extends Controller {
  public constructor() {
    super();
  }

  public async index(req: Request, res: Response, next: NextFunction) {
    try {
      log.info(`getting all users`);
      const users = await cache.remember("users", 60, () => {
        // Here's the function which refreshes the cache
        return User.find();
      });

      // console.log("====cahced users=====", users);
      return super.jsonRes(UserResource.collection(users), res);
    } catch (error) {
      return next(error);
    }
  }

  public async store(req: Request, res: Response, next: NextFunction) {
    try {
      super.validate(req.body, {
        username: "required|string",
        firstname: "required|string",
        lastname: "required|string",
        email: "required|email",
      });

      log.info(`creating a user with details ${JSON.stringify(req.body)}`);
      const user = await User.create(req.body);
      return super.jsonRes(user, res);
    } catch (error) {
      return next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      log.info(`getting user with id: ${req.params.id}`);
      const user = await User.findOne({ _id: req.params.id });

      return super.jsonRes(new UserResource(user), res);
    } catch (error) {
      return next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      log.info(`updating a user with id: ${req.body}`);
      const user = await User.create(req.body);
      return super.jsonRes(user, res);
    } catch (error) {
      return next(error);
    }
  }

  public async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      log.info(`deleting a user with id:`);
      const user = await User.create(req.body);
      return super.jsonRes(user, res);
    } catch (error) {
      return next(error);
    }
  }

  public async avatar(req: Request, res: Response, next: NextFunction) {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.upload(req?.file?.path as string);

      //save details to user

      return super.jsonRes(
        {
          url: result.url,
          fileId: result.asset_id,
          publicId: result.public_id,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }
}
