import ResetPassword from "@/models/reset-password-schema";
import { Types } from "mongoose";

const findById = async (id: Types.ObjectId) => {
  
  try {
    const user = await ResetPassword.findById(id).exec();
    if (!user) return null;
    return user;
  } catch (error) {
    console.error(`failed to get user by id: ${error}`);
    return null;
  }
};

const findOne = async (query: Record<string, any>) => {
    try {
      const user = await ResetPassword.findOne(query).exec(); 
      if (!user) return null;
      return user;
    } catch (error) {
      console.error(`Failed to get user: ${error}`);
      return null;
    }
  };

  export {
    findById,
    findOne
  }
