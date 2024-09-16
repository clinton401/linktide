import {Document, model, models, Schema} from "mongoose";

interface IReset extends Document {
    userEmail: string,
    code: string | null,
    expiresAt: Date | null
}

const ResetPasswordSchema = new Schema<IReset>({
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
}, { collection: 'reset-password' })

const ResetPassword = models?.ResetPassword || model<IReset>("ResetPassword", ResetPasswordSchema);

export default ResetPassword;