import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export default anthropic;

export const CHAT_MODEL = 'claude-sonnet-4-20250514';
export const SUMMARIZE_MODEL = 'claude-haiku-4-5-20251001';
