'use client';

import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function Spinner({ size = 'md', color }: SpinnerProps) {
  return (
    <div
      className={`${styles.spinner} ${styles[size]}`}
      style={color ? { borderTopColor: color } : undefined}
      aria-label="Loading"
    />
  );
}
