

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      oauth?: IOauth[]; 
      socialMedia?: ISocial[]; 
      "2FA"?: boolean;
      name: string;
      createdAt?: Date;
      updatedAt?: Date;
      isPasswordAvailable?: boolean;
    } & DefaultSession["user"];
  }
}
