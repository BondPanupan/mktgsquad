'use client';

import { useEffect, useRef } from 'react';
import type { IMessage, IAgent } from '@/types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SummaryBanner from './SummaryBanner';
import MessageInput from './MessageInput';
import styles from './ChatWindow.module.css';

interface ChatWindowProps {
  messages: IMessage[];
  streamingContent?: string;
  isStreaming: boolean;
  agent: IAgent;
  summary?: string | null;
  summarizedAt?: string | null;
  onSend: (message: string) => void;
}

export default function ChatWindow({
  messages,
  streamingContent,
  isStreaming,
  agent,
  summary,
  summarizedAt,
  onSend,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const visible = messages.filter((m) => !m.isArchived);

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        {summary && summarizedAt && (
          <SummaryBanner summary={summary} summarizedAt={summarizedAt} />
        )}
        {visible.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            agentColor={agent.color}
            agentName={agent.name}
          />
        ))}
        {isStreaming && !streamingContent && (
          <TypingIndicator agentColor={agent.color} agentName={agent.name} />
        )}
        {isStreaming && streamingContent && (
          <MessageBubble
            message={{
              _id: '__streaming__',
              role: 'assistant',
              content: streamingContent,
              tokensUsed: 0,
              model: '',
              isArchived: false,
              createdAt: new Date().toISOString(),
            }}
            agentColor={agent.color}
            agentName={agent.name}
          />
        )}
        <div ref={bottomRef} />
      </div>
      <MessageInput
        onSend={onSend}
        disabled={isStreaming}
        agentColor={agent.color}
        placeholder={`Ask ${agent.name} anything...`}
      />
    </div>
  );
}
