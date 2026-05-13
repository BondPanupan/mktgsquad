import type { AgentId } from '@/types';

export interface AgentDefinition {
  id: AgentId;
  name: string;
  role: string;
  color: string;
  description: string;
  systemPrompt: string;
}
