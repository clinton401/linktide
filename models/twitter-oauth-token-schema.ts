import {models, model, Document, Schema} from "mongoose";

interface IOAuthToken extends Document {
  codeVerifier: string;
    state: string;
    expiresAt: Date
  }
  
  const TwitterOAuthTokenSchema = new Schema<IOAuthToken>({
    codeVerifier: { type: Schema.Types.String, required: true, unique: true },
    state: { type: Schema.Types.String, required: true },
    expiresAt: { type: Schema.Types.Date, required: true },
  }, {  collection: "twitter-oauth" });


  const TwitterOauthToken = models?.TwitterOauthToken || model<IOAuthToken>("TwitterOauthToken", TwitterOAuthTokenSchema);

export default TwitterOauthToken;