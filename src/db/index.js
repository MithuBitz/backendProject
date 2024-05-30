import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

//All database related things must be in async await
const dbConnect = async () => {
  //Database things must be wrapped inside try/catch
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log("Log the connection instance : ", connectionInstance); //For testing and learning purpose
    console.log(
      `MongoDB connected :: DB_HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Database connection error : ", error);
    //use process node module to exit the process for failer or error
    process.exit(1);
  }
};

export default dbConnect;
