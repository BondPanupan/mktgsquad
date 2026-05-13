'use client';

import { useState, useCallback } from 'react';
import type { AgentId } from '@/types';

interface AgentResponse {
  agentId: AgentId;
  content: string;
  streaming: boolean;
  tokensUsed?: number;
}

export function useBroadcast() {
  const [streaming, setStreaming] = useState(false);
  const [responses, setResponses] = useState<AgentResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const broadcast = useCallback(async (prompt: string, agentIds: AgentId[]) => {
    setStreaming(true);
    setError(null);
    setResponses(agentIds.map((id) => ({ agentId: id, content: '', streaming: false })));

    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, agentIds }),
      });

      if (!res.ok || !res.body) throw new Error('Broadcast failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const chunk = JSON.parse(line.slice(6));

            if (chunk.type === 'agent_start') {
              setResponses((prev) =>
                prev.map((r) =>
                  r.agentId === chunk.agentId ? { ...r, streaming: true } : r
                )
              );
            } else if (chunk.type === 'delta') {
              setResponses((prev) =>
                prev.map((r) =>
                  r.agentId === chunk.agentId
                    ? { ...r, content: r.content + chunk.content }
                    : r
                )
              );
            } else if (chunk.type === 'agent_done') {
              setResponses((prev) =>
                prev.map((r) =>
                  r.agentId === chunk.agentId
                    ? { ...r, streaming: false, tokensUsed: chunk.tokensUsed }
                    : r
                )
              );
            } else if (chunk.type === 'error') {
              setError(chunk.error);
            }
          } catch {}
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Broadcast error');
    } finally {
      setStreaming(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResponses([]);
    setError(null);
  }, []);

  return { broadcast, streaming, responses, error, clear };
}
