import { models, model, Document, Schema } from "mongoose";

interface ITwitterAuth extends Document {
  oauthToken: string;
  oauthTokenSecret: string;
  expiresAt: Date;
}

const TwitterAuthSchema = new Schema<ITwitterAuth>(
  {
    oauthToken: { type: Schema.Types.String, required: true, unique: true },
    oauthTokenSecret: { type: Schema.Types.String, required: true },
    expiresAt: { type: Schema.Types.Date, required: true },
   
  },
  { collection: "twitter-auths" }
);

const TwitterAuth =
  models?.TwitterAuth || model<ITwitterAuth>("TwitterAuth", TwitterAuthSchema);

export default TwitterAuth;
