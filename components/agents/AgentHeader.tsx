'use client';

import type { IAgent } from '@/types';
import Badge from '@/components/ui/Badge';
import styles from './AgentHeader.module.css';

interface AgentHeaderProps {
  agent: IAgent;
}

export default function AgentHeader({ agent }: AgentHeaderProps) {
  return (
    <div
      className={styles.header}
      style={{ '--agent-color': agent.color } as React.CSSProperties}
    >
      <div className={styles.accent} style={{ background: agent.color }} />
      <div className={styles.info}>
        <div className={styles.top}>
          <span className={styles.name} style={{ color: agent.color }}>
            {agent.name}
          </span>
          <Badge label={agent.role} color={agent.color} size="sm" />
        </div>
        <p className={styles.desc}>{agent.description}</p>
      </div>
    </div>
  );
}
