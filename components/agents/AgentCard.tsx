'use client';

import Link from 'next/link';
import type { IAgent } from '@/types';
import Badge from '@/components/ui/Badge';
import styles from './AgentCard.module.css';

interface AgentCardProps {
  agent: IAgent;
  onSelect?: () => void;
  href?: string;
}

export default function AgentCard({ agent, onSelect, href }: AgentCardProps) {
  const content = (
    <div
      className={styles.card}
      style={{ '--agent-color': agent.color } as React.CSSProperties}
      onClick={onSelect}
    >
      <div className={styles.colorBar} style={{ background: agent.color }} />
      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.name} style={{ color: agent.color }}>
            {agent.name}
          </span>
          <Badge label={agent.isActive ? 'Active' : 'Offline'} color={agent.isActive ? '#00C853' : '#555'} size="sm" />
        </div>
        <p className={styles.role}>{agent.role}</p>
        <p className={styles.description}>{agent.description}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className={styles.link}>{content}</Link>;
  }

  return content;
}
