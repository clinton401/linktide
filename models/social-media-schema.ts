import { Document, Schema } from "mongoose";

export interface ISocial extends Document {
  name?: string;
  accessToken?: string;
  expiresAt?: Date;
  refreshToken?: string;
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
  expiresAt: {
    type: Schema.Types.Date,
    default: null,
  },
  refreshToken: {
    type: Schema.Types.String,
    default: null,
  },
});

export default SocialMediaSchema;
