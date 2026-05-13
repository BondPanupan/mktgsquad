'use client';

import { signOut } from 'next-auth/react';
import styles from './Topbar.module.css';

interface TopbarProps {
  userName?: string;
}

export default function Topbar({ userName }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>mktgsquad</span>
      </div>
      <div className={styles.right}>
        {userName && <span className={styles.user}>{userName}</span>}
        <button
          className={styles.signout}
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
