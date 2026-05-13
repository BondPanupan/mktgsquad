'use client';

import styles from './TypingIndicator.module.css';

interface TypingIndicatorProps {
  agentColor?: string;
  agentName?: string;
}

export default function TypingIndicator({ agentColor, agentName }: TypingIndicatorProps) {
  return (
    <div className={styles.row}>
      <div
        className={styles.avatar}
        style={{ background: agentColor ?? '#666', color: '#0b0b18' }}
      >
        {(agentName ?? 'AI')[0]}
      </div>
      <div className={styles.bubble} style={{ borderLeftColor: agentColor ?? '#666' }}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}
