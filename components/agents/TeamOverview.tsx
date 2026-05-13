'use client';

import type { IAgent } from '@/types';
import AgentCard from './AgentCard';
import styles from './TeamOverview.module.css';

interface TeamOverviewProps {
  agents: IAgent[];
}

export default function TeamOverview({ agents }: TeamOverviewProps) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Your Squad</h1>
      <p className={styles.subtitle}>
        6 specialized AI marketing agents ready to help you execute.
      </p>
      <div className={styles.grid}>
        {agents.map((agent) => (
          <AgentCard
            key={agent.agentId}
            agent={agent}
            href={`/chat?agent=${agent.agentId}`}
          />
        ))}
      </div>
    </div>
  );
}
