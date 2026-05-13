'use client';

import type { IMessage } from '@/types';
import { formatDate } from '@/lib/utils';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: IMessage;
  agentColor?: string;
  agentName?: string;
}

export default function MessageBubble({
  message,
  agentColor,
  agentName,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.row} ${isUser ? styles.userRow : styles.agentRow}`}>
      {!isUser && (
        <div
          className={styles.avatar}
          style={{ background: agentColor ?? '#666', color: '#0b0b18' }}
        >
          {(agentName ?? 'AI')[0]}
        </div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.agentBubble}`}
        style={!isUser ? { borderLeftColor: agentColor ?? '#666' } : undefined}
      >
        <div className={styles.content}>{message.content}</div>
        <div className={styles.meta}>
          <span className={styles.time}>{formatDate(message.createdAt)}</span>
          {message.tokensUsed > 0 && (
            <span className={styles.tokens}>{message.tokensUsed} tokens</span>
          )}
        </div>
      </div>
      {isUser && <div className={styles.userDot} />}
    </div>
  );
}
