import mongoose, { Schema, Document, Model } from 'mongoose';
import type { AgentId } from '@/types';

export interface IMessageSubdoc {
  _id: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  tokensUsed: number;
  model: string;
  isArchived: boolean;
  createdAt: Date;
}

export interface IConversationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  agentId: AgentId;
  title: string;
  messages: IMessageSubdoc[];
  summary: string | null;
  summarizedAt: Date | null;
  totalTokens: number;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageSubdoc>(
  {
    role: { type: String, required: true, enum: ['user', 'assistant'] },
    content: { type: String, required: true },
    tokensUsed: { type: Number, default: 0 },
    model: { type: String, default: '' },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ConversationSchema = new Schema<IConversationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: {
      type: String,
      required: true,
      enum: ['apex', 'bolt', 'pixel', 'rank', 'pulse', 'forge'],
    },
    title: { type: String, required: true, default: 'New Conversation' },
    messages: [MessageSchema],
    summary: { type: String, default: null },
    summarizedAt: { type: Date, default: null },
    totalTokens: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ConversationModel: Model<IConversationDocument> =
  mongoose.models.Conversation ??
  mongoose.model<IConversationDocument>('Conversation', ConversationSchema);

export default ConversationModel;
