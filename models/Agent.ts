import mongoose, { Schema, Document, Model } from 'mongoose';
import type { AgentId } from '@/types';

export interface IAgentDocument extends Document {
  agentId: AgentId;
  name: string;
  role: string;
  color: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgentDocument>(
  {
    agentId: {
      type: String,
      required: true,
      unique: true,
      enum: ['apex', 'bolt', 'pixel', 'rank', 'pulse', 'forge'],
    },
    name: { type: String, required: true },
    role: { type: String, required: true },
    color: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AgentModel: Model<IAgentDocument> =
  mongoose.models.Agent ?? mongoose.model<IAgentDocument>('Agent', AgentSchema);

export default AgentModel;
