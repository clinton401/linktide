
import mongoose from "mongoose";

const { MONGODB_URI } = process.env;


if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be defined");
}

export const connectToDatabase = async () => {
  "use server"
  if (typeof window !== 'undefined') {
    throw new Error("This function should only be run on the server");
  }
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