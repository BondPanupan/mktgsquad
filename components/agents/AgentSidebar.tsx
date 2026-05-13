'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IAgent } from '@/types';
import styles from './AgentSidebar.module.css';

interface AgentSidebarProps {
  agents: IAgent[];
  currentAgentId?: string;
}

export default function AgentSidebar({ agents, currentAgentId }: AgentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.label}>Agents</div>
      <nav className={styles.nav}>
        {agents.map((agent) => {
          const active = currentAgentId === agent.agentId || pathname.includes(agent.agentId);
          return (
            <Link
              key={agent.agentId}
              href={`/chat?agent=${agent.agentId}`}
              className={`${styles.item} ${active ? styles.active : ''}`}
              style={active ? { borderLeftColor: agent.color, color: agent.color } : undefined}
            >
              <span
                className={styles.dot}
                style={{ background: agent.color }}
              />
              <span className={styles.name}>{agent.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className={styles.divider} />
      <Link href="/team" className={styles.teamLink}>
        Team Overview
      </Link>
    </aside>
  );
}
