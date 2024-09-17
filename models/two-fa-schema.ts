import {Document, model, models, Schema} from "mongoose";

interface ITwoFa extends Document {
    userEmail: string,
    code: string | null,
    expiresAt: Date | null
}

const TwoFASchema = new Schema<ITwoFa>({
    userEmail: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    ref: 'User',
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address",
    ],
  },
    code: {
        type: String,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
}, { collection: 'two-fa' })

const TwoFA = models?.TwoFA || model<ITwoFa>("TwoFA", TwoFASchema);

export default TwoFA;