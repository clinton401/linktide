
import { Document, Schema, model, models } from "mongoose";

export interface IAiUsage extends Document {
  userId: Schema.Types.ObjectId; 
  prompt: string;
  createdAt: Date;
}

const AiUsageSchema = new Schema<IAiUsage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: false }
);

const AIUsage =  models.AiUsage || model<IAiUsage>("AiUsage", AiUsageSchema);
export default AIUsage
