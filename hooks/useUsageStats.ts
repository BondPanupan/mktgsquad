'use client';

import { useState, useEffect } from 'react';
import type { IUsageStat, AgentId } from '@/types';
import { AGENT_COLORS, AGENT_NAMES } from '@/lib/utils';

interface AgentUsage {
  agentId: AgentId;
  name: string;
  color: string;
  totalMessages: number;
  totalTokens: number;
}

export function useUsageStats(days = 30) {
  const [stats, setStats] = useState<IUsageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/usage?days=${days}`)
      .then((r) => r.json())
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [days]);

  const byAgent: AgentUsage[] = Object.entries(
    stats.reduce<Record<string, { messages: number; tokens: number }>>(
      (acc, stat) => {
        if (!acc[stat.agentId]) acc[stat.agentId] = { messages: 0, tokens: 0 };
        acc[stat.agentId].messages += stat.messagesCount;
        acc[stat.agentId].tokens += stat.tokensUsed;
        return acc;
      },
      {}
    )
  ).map(([agentId, data]) => ({
    agentId: agentId as AgentId,
    name: AGENT_NAMES[agentId as AgentId],
    color: AGENT_COLORS[agentId as AgentId],
    totalMessages: data.messages,
    totalTokens: data.tokens,
  }));

  const totalTokens = stats.reduce((s, r) => s + r.tokensUsed, 0);
  const totalMessages = stats.reduce((s, r) => s + r.messagesCount, 0);

  return { stats, byAgent, totalTokens, totalMessages, loading, error };
}
