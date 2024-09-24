import {models, model, Document, Schema} from "mongoose";

interface IOAuthToken extends Document {
    oauthToken: string;
    oauthTokenSecret: string;
    expiresAt: Date
  }
  
  const TwitterOAuthTokenSchema = new Schema<IOAuthToken>({
    oauthToken: { type: Schema.Types.String, required: true, unique: true },
    oauthTokenSecret: { type: Schema.Types.String, required: true },
    expiresAt: { type: Schema.Types.Date, required: true },
  }, {  collection: "twitter-oauth" });


  const TwitterOauthToken = models?.TwitterOauthToken || model<IOAuthToken>("TwitterOauthToken", TwitterOAuthTokenSchema);

export default TwitterOauthToken;