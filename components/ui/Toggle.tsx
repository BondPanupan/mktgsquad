'use client';

import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  color?: string;
}

export default function Toggle({ checked, onChange, label, color }: ToggleProps) {
  return (
    <label className={styles.wrapper}>
      <span className={styles.toggle}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={styles.input}
        />
        <span
          className={`${styles.track} ${checked ? styles.on : ''}`}
          style={checked && color ? { backgroundColor: color } : undefined}
        />
        <span className={`${styles.thumb} ${checked ? styles.thumbOn : ''}`} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
