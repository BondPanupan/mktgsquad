export type AgentId = 'apex' | 'bolt' | 'pixel' | 'rank' | 'pulse' | 'forge';

export interface IMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  tokensUsed: number;
  model: string;
  isArchived: boolean;
  createdAt: string;
}

export interface IConversation {
  _id: string;
  userId: string;
  agentId: AgentId;
  title: string;
  messages: IMessage[];
  summary: string | null;
  summarizedAt: string | null;
  totalTokens: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAgent {
  _id: string;
  agentId: AgentId;
  name: string;
  role: string;
  color: string;
  description: string;
  isActive: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface IBroadcastSession {
  _id: string;
  userId: string;
  prompt: string;
  agentIds: AgentId[];
  responses: {
    agentId: AgentId;
    content: string;
    tokensUsed: number;
    completedAt: string;
  }[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
}

export interface IUsageStat {
  _id: string;
  userId: string;
  agentId: AgentId;
  date: string;
  messagesCount: number;
  tokensUsed: number;
}

export interface ChatRequest {
  conversationId: string;
  message: string;
  agentId: AgentId;
}

export interface StreamChunk {
  type: 'delta' | 'done' | 'error';
  content?: string;
  tokensUsed?: number;
  error?: string;
}

export interface BroadcastRequest {
  prompt: string;
  agentIds: AgentId[];
}

export interface ApiError {
  error: string;
}
