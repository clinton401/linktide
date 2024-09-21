import {models, model, Document, Schema} from "mongoose";

interface IOAuthToken extends Document {
    oauthToken: string;
    oauthTokenSecret: string;
  }
  
  const TwitterOAuthTokenSchema = new Schema<IOAuthToken>({
    oauthToken: { type: String, required: true, unique: true },
    oauthTokenSecret: { type: String, required: true },
  }, {  collection: "twitter-oauth" });


  const TwitterOauthToken = models?.TwitterOauthToken || model<IOAuthToken>("TwitterOauthToken", TwitterOAuthTokenSchema);

export default TwitterOauthToken;