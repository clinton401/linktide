"use server"
import { SecuritySchema } from "@/schemas";
import * as z from "zod";
import { findOne } from "@/data/users-data";
import { connectToDatabase } from "@/lib/db";
import {validatePassword} from "@/lib/password-utils";
import { getServerUser } from "@/hooks/get-server-user";

export const newSecurity = async (values: z.infer<typeof SecuritySchema>) => {
    const session = await getServerUser();
    if(!session) {
        return{
            error: "User not authorized",
            success: undefined,
        }
    }
const validatedFields = SecuritySchema.safeParse(values);
if(!validatedFields.success) return {
    error: "Invalid Fields",
    success: undefined
}

const {twoFA, newPassword} = validatedFields.data;

if(twoFA === undefined && !newPassword) {
    return {
        error: "At least one of the fields must be provided",
        success: ""
    }
}

try{
    await connectToDatabase();
    const user = await findOne({email: session.email});
    if (!user)
        return {
          error: "User not found",
          success: undefined,
        };
        if(twoFA !== undefined) {
            user["2FA"] = twoFA
        };
        if(newPassword) {
            if(!user?.password) {
                return {
                    error: "Password can't be changed for accounts signed in with an OAuth provider.",
                    success: ""
                }
            }
            if(newPassword.length < 6) return {
                error: "Password must be at least 6 characters long",
                success: undefined,
              }
              const isPasswordTheSameAsLastOne =  await validatePassword(newPassword, user.password);
              if(isPasswordTheSameAsLastOne) return {
                error: "New password cannot be the same as the current one",
                success: undefined,
              };
              user.password = newPassword
             
        }
        await user.save();
        return {
          success: "Security details changed successfully",
          error: undefined,
        };

}catch(err){
    console.error(`error while resetting security details: ${err}`)
    if (err instanceof Error) {
        return {
          error: err.message,
          success: undefined,
          
        };
      }
      return {
        error: "An unknown error occurred.",
        success: undefined,
      };
}

}