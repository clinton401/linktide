import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user-schema";
import { IVerification } from "@/models/verification-schema";
import { Types } from "mongoose";
import { IOauth } from "@/models/oauth-schema";
import { ISocial } from "@/models/social-media-schema";
import { Session } from "next-auth";

import { findOne, findById } from "@/data/users-data";
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
        await connectToDatabase();
      if (account?.provider === "credentials") {
        const existingUser = await findOne({
          email: user.email?.toLowerCase(),
        });
        if (
          !existingUser ||
          !existingUser.emailVerification ||
          existingUser.emailVerification.verified === false
        )
          return false;
        return true;
      }

      if (account?.provider && account.provider !== "credentials") {
        

        if (!user.email) {
          console.log("User email is missing.");
          return false;
        }
        // Check if user exists
        const existingUser = await User.findOne({
          email: user.email.toLowerCase(),
        });

        if (existingUser) {
            existingUser["2FA"] = false
          existingUser.emailVerification = {
            code: null,
            expiresAt: null,
            verified: true,
          };
          const providerAccount = existingUser.oauth.find(
            (acc: IOauth) => acc.provider === account.provider
          );

          if (!providerAccount) {
            existingUser.oauth.push({
              provider: account.provider,
              providerAccountId: account.providerAccountId || "",
              accessToken: account.access_token || "",
            });
          }
          await existingUser.save();
          return true;
        }
        const newUser = new User({
          email: user.email,
          name: user?.name || "User",
          image: user.image || account.picture || account.image ||  "",
          "2FA": false,
          oauth: [
            {
              provider: account.provider,
              providerAccountId: account.providerAccountId || "",
              accessToken: account?.access_token || "",
            },
          ],
          emailVerification: {
            code: null,
            expiresAt: null,
            verified: true,
          },
        });

        await newUser.save();
        console.log("OAuth user created");
        return true;
      }

      return true;
    },
    async jwt({ token }) {
      await connectToDatabase();
      let user;

      if (token.sub && Types.ObjectId.isValid(token.sub)) {
        const id = new Types.ObjectId(token.sub);
        user = await findById(id);
      } else if (token.email) {
        user = await findOne({ email: token.email.toLowerCase() });
      }

      if (user) {
        token.sub = user._id.toString();
        token.oauth = user.oauth;
        token.socialMedia = user.socialMedia;
        token["2FA"] = user["2FA"];
        token.name = user.name;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        token.isPasswordAvailable = !!user.password;
      }

      return token;
    },
    async session({ token, session }: { session: Session; token: any }) {
      if (!token || !session?.user) return session;
      if (token.sub) {
        session.user.id = token.sub;
      }

      if (token.oauth) {
        session.user.oauth = token.oauth;
      }

      if (token.socialMedia) {
        session.user.socialMedia = token.socialMedia;
      }

      if (token["2FA"] !== undefined) {
        session.user["2FA"] = token["2FA"];
      }

      if (token.name) {
        session.user.name = token.name;
      }

      if (token.createdAt) {
        session.user.createdAt = token.createdAt;
      }

      if (token.updatedAt) {
        session.user.updatedAt = token.updatedAt;
      }

      if (token.isPasswordAvailable !== undefined) {
        session.user.isPasswordAvailable = token.isPasswordAvailable;
      }
      return session;
    },
  },
  ...authConfig,
});
