'use client';

import styles from './Badge.module.css';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ label, color, size = 'md' }: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[size]}`}
      style={
        color
          ? {
              backgroundColor: `${color}22`,
              color,
              borderColor: `${color}44`,
            }
          : undefined
      }
    >
      {label}
    </span>
  );
}
