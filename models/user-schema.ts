import  { Document, Schema, model, models } from "mongoose";
import OAuthSchema, { IOauth } from "@/models/oauth-schema";
import SocialMediaSchema, { ISocial } from "@/models/social-media-schema";
import VerificationSchema, { IVerification } from "@/models/verification-schema";
import {genPassword} from "@/lib/password-utils"
export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  image: string;
  "2FA": boolean;
  createdAt: Date;
  updatedAt: Date;
  oauth: IOauth[];
  socialMedia: ISocial[];
  emailVerification: IVerification;
}

const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address",
    ],
  },
  name: {
    type: Schema.Types.String,
    required: true,
    set: (value: string) => {
      if (!value) return value;
      return value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    },
    minlength: [3, "Name must be at least 3 characters long"],
    default: 'User',
  },
  password: {
    type: Schema.Types.String,
    required: false,
    validate: {
      validator: function(value: string) {
        if (value === "") return true;
        return value.length >= 6;
      },
      message: "Password must be at least 6 characters long",
    },
  },
  image: {
    type: Schema.Types.String,
    default: "",
  },
  "2FA": {
    type: Schema.Types.Boolean,
    default: false,
  },
  oauth: [OAuthSchema],
  socialMedia: [SocialMediaSchema],
  emailVerification: {
    type: VerificationSchema,
    required: true,
  },
}, {
  collection: "users-data",
  timestamps: true, 
});

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      try {
        const password = this.password;
        if (password) {
          const hashedPassword = await genPassword(password);
          this.password = hashedPassword;
        }
      } catch (err) {
        next(err as any);
        return;
      }
    }
    next();
  });

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
