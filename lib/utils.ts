import type { AgentId } from '@/types';

export const AGENT_COLORS: Record<AgentId, string> = {
  apex: '#E8445A',
  bolt: '#4285F4',
  pixel: '#FF6D00',
  rank: '#00C853',
  pulse: '#AA00FF',
  forge: '#00BCD4',
};

export const AGENT_NAMES: Record<AgentId, string> = {
  apex: 'APEX',
  bolt: 'BOLT',
  pixel: 'PIXEL',
  rank: 'RANK',
  pulse: 'PULSE',
  forge: 'FORGE',
};

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return tokens.toString();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + '...';
}

export function generateTitle(content: string): string {
  return truncate(content, 50);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
