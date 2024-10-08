"use server";
import { findOne } from "@/data/users-data";
import { getServerUser } from "@/hooks/get-server-user";
import { connectToDatabase } from "@/lib/db";
import type { ISocial } from "@/models/social-media-schema";

export const platformLogout = async (name: string) => {
  const session = await getServerUser();

  if (!session) {
    return { error: "User not allowed to view this resource", success: false };
  }

  try {
    await connectToDatabase();
    
    const user = await findOne({ email: session.email });
    
    if (!user) {
      return { error: "User not found", success: false };
    }

    const newPlatforms = user.socialMedia?.filter(
      (app: ISocial) => app.name !== name
    );

    user.socialMedia = newPlatforms || [];
    await user.save();

    return {
      success: `Logged out of ${name} successfully`,
      error: undefined,
    };
  } catch (error) {
    console.error(`Error occurred while logging out of ${name}: `, error);

    return {
      error: `Error occurred while logging out of ${name}`,
      success: false,
    };
  }
};
