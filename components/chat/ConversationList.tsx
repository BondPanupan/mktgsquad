'use client';

import Link from 'next/link';
import type { IConversation } from '@/types';
import { AGENT_COLORS, AGENT_NAMES, formatDate, truncate } from '@/lib/utils';
import styles from './ConversationList.module.css';

interface ConversationListProps {
  conversations: IConversation[];
  currentId?: string;
  onNew?: () => void;
}

export default function ConversationList({
  conversations,
  currentId,
  onNew,
}: ConversationListProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>Conversations</span>
        {onNew && (
          <button className={styles.newBtn} onClick={onNew} aria-label="New conversation">
            +
          </button>
        )}
      </div>
      <div className={styles.list}>
        {conversations.length === 0 && (
          <p className={styles.empty}>No conversations yet.</p>
        )}
        {conversations.map((conv) => {
          const color = AGENT_COLORS[conv.agentId];
          const agentName = AGENT_NAMES[conv.agentId];
          const active = currentId === conv._id;
          return (
            <Link
              key={conv._id}
              href={`/chat/${conv._id}`}
              className={`${styles.item} ${active ? styles.active : ''}`}
              style={active ? { borderLeftColor: color } : undefined}
            >
              <div className={styles.itemHeader}>
                <span className={styles.agent} style={{ color }}>
                  {agentName}
                </span>
                <span className={styles.date}>
                  {formatDate(conv.updatedAt)}
                </span>
              </div>
              <span className={styles.title}>{truncate(conv.title, 40)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
