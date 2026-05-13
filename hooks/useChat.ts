'use client';

import { useState, useCallback } from 'react';
import type { IMessage, AgentId } from '@/types';

interface UseChatOptions {
  conversationId: string;
  agentId: AgentId;
  initialMessages?: IMessage[];
}

export function useChat({ conversationId, agentId, initialMessages = [] }: UseChatOptions) {
  const [messages, setMessages] = useState<IMessage[]>(initialMessages);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (content: string) => {
    setError(null);
    setIsStreaming(true);
    setStreamingContent('');

    const userMsg: IMessage = {
      _id: `tmp_${Date.now()}`,
      role: 'user',
      content,
      tokensUsed: 0,
      model: '',
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: content, agentId }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Failed to start chat stream');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6);
          try {
            const chunk = JSON.parse(json);
            if (chunk.type === 'delta') {
              accumulated += chunk.content;
              setStreamingContent(accumulated);
            } else if (chunk.type === 'done') {
              const assistantMsg: IMessage = {
                _id: `tmp_${Date.now()}_ai`,
                role: 'assistant',
                content: accumulated,
                tokensUsed: chunk.tokensUsed ?? 0,
                model: 'claude-sonnet-4-20250514',
                isArchived: false,
                createdAt: new Date().toISOString(),
              };
              setMessages((prev) => [...prev, assistantMsg]);
              setStreamingContent('');
            } else if (chunk.type === 'error') {
              setError(chunk.error ?? 'Stream error');
            }
          } catch {}
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setMessages((prev) => prev.filter((m) => m._id !== userMsg._id));
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  }, [conversationId, agentId]);

  return { messages, streamingContent, isStreaming, error, send };
}
