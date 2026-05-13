'use client';

import { useState, useEffect, useCallback } from 'react';
import type { IConversation, AgentId } from '@/types';

export function useConversations() {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_list = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_list();
  }, [fetch_list]);

  const createConversation = useCallback(async (agentId: AgentId): Promise<IConversation | null> => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });
      const conv: IConversation = await res.json();
      setConversations((prev) => [conv, ...prev]);
      return conv;
    } catch {
      return null;
    }
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConversations((prev) => prev.filter((c) => c._id !== id));
    }
  }, []);

  return { conversations, loading, error, createConversation, deleteConversation, refresh: fetch_list };
}
