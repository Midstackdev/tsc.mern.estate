/**
 * This page demonstrates how to use interfaces, Models and schmas to effectivley interact with MongoDB
 */

import UserSchema from "../DbSchema/user";
import { BaseModel } from "../libs/database/Model";

/*
 * Use this model class to have acess to common CRUD features
 * Additional you can write custom query methods in this class for the model
 */
export class UserModel extends BaseModel {
  constructor() {
    super(UserSchema);
  }
}

export const User = new UserModel();
