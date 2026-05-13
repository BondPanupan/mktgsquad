'use client';

import { formatDate } from '@/lib/utils';
import styles from './SummaryBanner.module.css';

interface SummaryBannerProps {
  summary: string;
  summarizedAt: string;
}

export default function SummaryBanner({ summary, summarizedAt }: SummaryBannerProps) {
  return (
    <div className={styles.banner}>
      <div className={styles.icon}>∑</div>
      <div className={styles.body}>
        <div className={styles.label}>
          Conversation summarized · {formatDate(summarizedAt)}
        </div>
        <p className={styles.text}>{summary}</p>
      </div>
    </div>
  );
}
