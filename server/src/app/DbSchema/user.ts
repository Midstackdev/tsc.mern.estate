/**
 * This page demonstrates how to use interfaces, Models and schmas to effectivley interact with MongoDB
 */

import mongoose, { Document, Schema } from "mongoose";
import {
  DELIVERY_MODE,
  DELIVERY_MODE_VALUES,
  ROLES,
  ROLES_VALUES,
  TWO_FACTOR_TYPE,
  TWO_FACTOR_TYPE_VALUES,
} from "../Enums";

type Details = {
  username?: string;
  picture?: string;
};

export type IUser = {
  _id?: string;
  name: string;
  password: string;
  email: string;
  emailVerifiedAt: Date;
  refreshToken?: string;
  settings: {
    twoFactor: {
      enabled: boolean;
      type: string;
      delivery: string;
      secret: string;
    };
  };
  role: string;
  details?: Details;
};

export type UserDoc = IUser & Document;

const Settings = new Schema({
  twoFactor: new Schema({
    enabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: TWO_FACTOR_TYPE_VALUES,
      default: TWO_FACTOR_TYPE.APP,
    },
    delivery: {
      type: String,
      enum: DELIVERY_MODE_VALUES,
      default: DELIVERY_MODE.EMAIL,
    },
    secret: {
      type: String,
      default: "",
    },
  }),
});

const NestedSchema = new Schema({
  username: { type: String },
  picture: { type: String },
});

/*
 * Create the schmema that will reflect the MongoDB collection
 */
const UserSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    emailVerifiedAt: { type: Date },
    refreshToken: { type: String },
    details: NestedSchema,
    settings: Settings,
    role: {
      type: String,
      enum: ROLES_VALUES,
      default: ROLES.USER,
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserDoc>("User", UserSchema);
