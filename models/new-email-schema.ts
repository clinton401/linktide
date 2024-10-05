import {model, models, Document, Schema} from "mongoose";

interface INewEmail extends Document {
    verificationCode: string,
    expiresAt: Date,
    email: string,
    newEmail: string;
};

const NewEmailSchema = new Schema<INewEmail>({
    email: {
        type: Schema.Types.String,
        required: true,
        lowercase: true,
        match: [
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please enter a valid email address",
        ],
      },
    newEmail: {
        type: Schema.Types.String,
        required: true,
        lowercase: true,
        match: [
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please enter a valid email address",
        ],
      },
    verificationCode: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Schema.Types.Date,
        required: true
    }
}, {collection: "new-emails"});

const NewEmail = models?.NewEmail || model<INewEmail>("NewEmail", NewEmailSchema);
export default NewEmail;