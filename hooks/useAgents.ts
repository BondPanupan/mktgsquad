'use client';

import { useState, useEffect } from 'react';
import type { IAgent } from '@/types';

export function useAgents() {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then(setAgents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleAgent = async (agentId: string, isActive: boolean) => {
    const res = await fetch(`/api/agents/${agentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });
    if (res.ok) {
      const updated: IAgent = await res.json();
      setAgents((prev) =>
        prev.map((a) => (a.agentId === agentId ? updated : a))
      );
    }
  };

  return { agents, loading, error, toggleAgent };
}
