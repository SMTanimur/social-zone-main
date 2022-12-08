import mongoose from "mongoose";
import env from "../configs/env";

const mongooseLoaders = async () => {
  try {
    await mongoose.connect(env.database.mongoUrl);
    console.log("successfully for MongoDB connected");
  } catch (error: any) {
    console.log(`Failed to connect to MongoDB - ${error?.message}`);
    throw new Error(`Failed to connect to MongoDB`);
  }
};

export default mongooseLoaders;
