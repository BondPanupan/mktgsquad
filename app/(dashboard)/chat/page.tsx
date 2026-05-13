'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useConversations } from '@/hooks/useConversations';
import ConversationList from '@/components/chat/ConversationList';
import BroadcastBar from '@/components/chat/BroadcastBar';
import Spinner from '@/components/ui/Spinner';
import type { AgentId } from '@/types';
import styles from './chat.module.css';

export default function ChatIndexPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentParam = searchParams.get('agent') as AgentId | null;
  const { conversations, loading, createConversation } = useConversations();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (agentParam && !creating) {
      setCreating(true);
      createConversation(agentParam).then((conv) => {
        if (conv) router.push(`/chat/${conv._id}`);
      });
    }
  }, [agentParam, creating, createConversation, router]);

  if (loading || creating) {
    return (
      <div className={styles.center}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <BroadcastBar />
      <div className={styles.body}>
        <ConversationList
          conversations={conversations}
          onNew={() => router.push('/team')}
        />
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💬</div>
          <h2 className={styles.emptyTitle}>Select an agent to start</h2>
          <p className={styles.emptyText}>
            Choose an agent from the sidebar or pick one from the Team page.
          </p>
        </div>
      </div>
    </div>
  );
}
