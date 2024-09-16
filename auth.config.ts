import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { LoginSchema } from "@/schemas";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { validatePassword } from "@/lib/password-utils";
import {findOne} from "@/data/users-data";


export default {
  providers: [
    GitHub({
        clientId: process.env.GITHUB_CLIENT_ID  as  string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET  as  string
    }),
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID  as  string,
clientSecret: process.env.GOOGLE_CLIENT_SECRET  as  string
    }),
    Credentials({
      async authorize(credentials) {
        await connectToDatabase();
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await findOne({ email: email.toLowerCase() });
          if (!user  || !user.password ) return null;
          const isValid = await validatePassword(password, user.password);
          if (!isValid) return null;
         
          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
