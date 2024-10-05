"use server"
import User from "@/models/user-schema";
import { getServerUser } from "@/hooks/get-server-user";
import { connectToDatabase } from "@/lib/db";

export const deleteAccount = async () => {
  const session = await getServerUser();
  if (!session) {
    return {
      error: "User not authorized",
      success: undefined,
      redirectUrl: "/auth/login",
    };
  }

  try {
    await connectToDatabase();

    const user = await User.findOneAndDelete({ email: session.email });

    if (!user) {
      return {
        error: "User not found",
        success: undefined,
        redirectUrl: undefined,
      };
    }

    return {
      error: undefined,
      success: "Your account has been deleted successfully.",
      redirectUrl: undefined,
    };
  } catch (err) {
    console.error(`Error while deleting account: ${err}`);
    if (err instanceof Error) {
      return {
        error: err.message,
        success: undefined,
        redirectUrl: undefined,
      };
    }
    return {
      error: "An unknown error occurred.",
      success: undefined,
      redirectUrl: undefined,
    };
  }
};
