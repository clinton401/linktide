import { Document, Schema } from "mongoose";

export interface ISocial extends Document {
  name?: string;
  accessToken?: string;
  expiresAt?: Date;
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  userId?: string;
}

const SocialMediaSchema: Schema<ISocial> = new Schema({
  name: {
    type: Schema.Types.String,
    default: null,
  },
  accessToken: {
    type: Schema.Types.String,
    default: null,
  },
  userId: {
    type: Schema.Types.String,
    default: null,
  },
  expiresAt: {
    type: Schema.Types.Date,
    default: () => Date.now() + 3_000_000,
  },
  
  refreshToken: {
    type: Schema.Types.String,
    default: null,
  },
  refreshTokenExpiresAt: {
    type: Schema.Types.Date,
    default: null,
  },
});

export default SocialMediaSchema;
