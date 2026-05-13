import mongoose, { Schema, Document, Model } from 'mongoose';
import type { AgentId } from '@/types';

export interface IBroadcastResponseSubdoc {
  agentId: AgentId;
  content: string;
  tokensUsed: number;
  completedAt: Date;
}

export interface IBroadcastSessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  agentIds: AgentId[];
  responses: IBroadcastResponseSubdoc[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const BroadcastResponseSchema = new Schema<IBroadcastResponseSubdoc>(
  {
    agentId: {
      type: String,
      required: true,
      enum: ['apex', 'bolt', 'pixel', 'rank', 'pulse', 'forge'],
    },
    content: { type: String, required: true },
    tokensUsed: { type: Number, default: 0 },
    completedAt: { type: Date, required: true },
  },
  { _id: false }
);

const BroadcastSessionSchema = new Schema<IBroadcastSessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    agentIds: [{ type: String, enum: ['apex', 'bolt', 'pixel', 'rank', 'pulse', 'forge'] }],
    responses: [BroadcastResponseSchema],
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const BroadcastSessionModel: Model<IBroadcastSessionDocument> =
  mongoose.models.BroadcastSession ??
  mongoose.model<IBroadcastSessionDocument>(
    'BroadcastSession',
    BroadcastSessionSchema
  );

export default BroadcastSessionModel;
