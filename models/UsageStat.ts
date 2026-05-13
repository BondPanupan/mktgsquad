import mongoose, { Schema, Document, Model } from 'mongoose';
import type { AgentId } from '@/types';

export interface IUsageStatDocument extends Document {
  userId: mongoose.Types.ObjectId;
  agentId: AgentId;
  date: string;
  messagesCount: number;
  tokensUsed: number;
}

const UsageStatSchema = new Schema<IUsageStatDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: {
      type: String,
      required: true,
      enum: ['apex', 'bolt', 'pixel', 'rank', 'pulse', 'forge'],
    },
    date: { type: String, required: true },
    messagesCount: { type: Number, default: 0 },
    tokensUsed: { type: Number, default: 0 },
  },
  { timestamps: false }
);

UsageStatSchema.index({ userId: 1, agentId: 1, date: 1 }, { unique: true });

const UsageStatModel: Model<IUsageStatDocument> =
  mongoose.models.UsageStat ??
  mongoose.model<IUsageStatDocument>('UsageStat', UsageStatSchema);

export default UsageStatModel;
