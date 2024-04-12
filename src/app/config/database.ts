import mongoose from "mongoose";
import { MONGO_URL } from ".";
import { log } from "../libs/logger";

const connectDB = async () => {
  // configure databse from this file

  try {
    const connect = await mongoose.connect(MONGO_URL);
    log.info("DB connection established");

    return connect;
  } catch (error) {
    log.error("DB connection failed");
    log.error(error);
    process.exit(1);
  }
};

export default connectDB;
