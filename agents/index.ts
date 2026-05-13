import apex from './apex';
import bolt from './bolt';
import pixel from './pixel';
import rank from './rank';
import pulse from './pulse';
import forge from './forge';
import type { AgentDefinition } from './types';
import type { AgentId } from '@/types';

export const agents: AgentDefinition[] = [apex, bolt, pixel, rank, pulse, forge];

export const agentMap: Record<AgentId, AgentDefinition> = {
  apex,
  bolt,
  pixel,
  rank,
  pulse,
  forge,
};

export function getAgent(id: AgentId): AgentDefinition | undefined {
  return agentMap[id];
}

export type { AgentDefinition };
