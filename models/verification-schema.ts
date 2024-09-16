import { Document, Schema } from 'mongoose';

export interface IVerification extends Document {
  code?: string;
  expiresAt?: Date;
  verified: boolean;
}

const VerificationSchema: Schema<IVerification> = new Schema({
  code: {
    type: Schema.Types.String,
    default: null,
  },
  expiresAt: {
    type: Schema.Types.Date,
    default: null,
  },
  verified: {
    type: Schema.Types.Boolean,
    default: false,
  },
});

export default VerificationSchema;
