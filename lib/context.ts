import type { IMessage } from '@/types';

const WINDOW_SIZE = 20;

export interface ContextMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function buildContext(
  messages: IMessage[],
  summary: string | null
): ContextMessage[] {
  const active = messages.filter((m) => !m.isArchived);
  const window = active.slice(-WINDOW_SIZE);

  const context: ContextMessage[] = [];

  if (summary) {
    context.push({
      role: 'user',
      content: `[Previous conversation summary]: ${summary}`,
    });
    context.push({
      role: 'assistant',
      content: 'Understood. I have context from our previous conversation.',
    });
  }

  for (const msg of window) {
    context.push({ role: msg.role, content: msg.content });
  }

  return context;
}
