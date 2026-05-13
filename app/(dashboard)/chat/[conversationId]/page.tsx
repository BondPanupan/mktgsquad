'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';
import ChatWindow from '@/components/chat/ChatWindow';
import AgentHeader from '@/components/agents/AgentHeader';
import ConversationList from '@/components/chat/ConversationList';
import BroadcastBar from '@/components/chat/BroadcastBar';
import Spinner from '@/components/ui/Spinner';
import { AGENT_COLORS } from '@/lib/utils';
import type { IConversation, IMessage, IAgent, AgentId } from '@/types';
import styles from './conversation.module.css';

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = use(params);
  const router = useRouter();

  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [agent, setAgent] = useState<IAgent | null>(null);
  const [initialMessages, setInitialMessages] = useState<IMessage[]>([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const { conversations, createConversation } = useConversations();

  useEffect(() => {
    fetch(`/api/conversations/${conversationId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((conv: IConversation) => {
        setConversation(conv);
        setInitialMessages(conv.messages ?? []);
        return fetch(`/api/agents/${conv.agentId}`);
      })
      .then((r) => r.json())
      .then(setAgent)
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [conversationId]);

  const { messages, streamingContent, isStreaming, error, send } = useChat({
    conversationId,
    agentId: (conversation?.agentId ?? 'apex') as AgentId,
    initialMessages,
  });

  const handleNew = async () => {
    if (!conversation) return;
    const conv = await createConversation(conversation.agentId);
    if (conv) router.push(`/chat/${conv._id}`);
  };

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (loadError || !conversation || !agent) {
    return (
      <div className={styles.center}>
        <p className={styles.error}>{loadError || 'Conversation not found'}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <BroadcastBar />
      <div className={styles.body}>
        <ConversationList
          conversations={conversations}
          currentId={conversationId}
          onNew={handleNew}
        />
        <div className={styles.chat}>
          <AgentHeader agent={agent} />
          {error && <div className={styles.streamError}>{error}</div>}
          <ChatWindow
            messages={messages}
            streamingContent={streamingContent}
            isStreaming={isStreaming}
            agent={agent}
            summary={conversation.summary}
            summarizedAt={conversation.summarizedAt}
            onSend={send}
          />
        </div>
      </div>
    </div>
  );
}
