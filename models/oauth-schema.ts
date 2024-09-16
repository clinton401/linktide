import { Document, Schema } from "mongoose";

export interface IOauth extends Document {
  provider: string;
  providerAccountId: string;
  accessToken: string;
}

const OAuthSchema: Schema<IOauth> = new Schema({
  provider: {
    type: Schema.Types.String,
    required: true,
  },
  providerAccountId: {
    type: Schema.Types.String,
    required: true,
  },
  accessToken: {
    type: Schema.Types.String,
    required: true,
  },
});

export default OAuthSchema;
