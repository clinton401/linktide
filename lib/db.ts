"use server"
import mongoose from "mongoose";

const { MONGODB_URI } = process.env;


if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be defined");
}

export const connectToDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI);
    if (connection.readyState === 1) {
      console.log("MongoDB Connected");
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}