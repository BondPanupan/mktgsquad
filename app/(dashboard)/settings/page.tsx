'use client';

import { useAgents } from '@/hooks/useAgents';
import { useUsageStats } from '@/hooks/useUsageStats';
import Toggle from '@/components/ui/Toggle';
import Spinner from '@/components/ui/Spinner';
import { formatTokens } from '@/lib/utils';
import styles from './settings.module.css';

export default function SettingsPage() {
  const { agents, loading: agentsLoading, toggleAgent } = useAgents();
  const { byAgent, totalTokens, totalMessages, loading: statsLoading } = useUsageStats(30);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Agent Availability</h2>
        <p className={styles.sectionDesc}>Enable or disable agents for your team.</p>
        {agentsLoading ? (
          <div className={styles.center}><Spinner /></div>
        ) : (
          <div className={styles.agentList}>
            {agents.map((agent) => (
              <div key={agent.agentId} className={styles.agentRow}>
                <div className={styles.agentInfo}>
                  <span className={styles.agentName} style={{ color: agent.color }}>
                    {agent.name}
                  </span>
                  <span className={styles.agentRole}>{agent.role}</span>
                </div>
                <Toggle
                  checked={agent.isActive}
                  onChange={(v) => toggleAgent(agent.agentId, v)}
                  color={agent.color}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage — Last 30 Days</h2>
        {statsLoading ? (
          <div className={styles.center}><Spinner /></div>
        ) : (
          <>
            <div className={styles.statRow}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{totalMessages}</span>
                <span className={styles.statLabel}>Total Messages</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{formatTokens(totalTokens)}</span>
                <span className={styles.statLabel}>Total Tokens</span>
              </div>
            </div>
            <div className={styles.agentStats}>
              {byAgent.map((a) => (
                <div key={a.agentId} className={styles.agentStatRow}>
                  <span className={styles.agentStatName} style={{ color: a.color }}>
                    {a.name}
                  </span>
                  <span className={styles.agentStatVal}>{a.totalMessages} msgs</span>
                  <span className={styles.agentStatVal}>{formatTokens(a.totalTokens)} tokens</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
