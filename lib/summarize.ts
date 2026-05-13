import anthropic, { SUMMARIZE_MODEL } from '@/lib/anthropic';
import { connectDB } from '@/lib/mongodb';
import ConversationModel from '@/models/Conversation';

const TOKEN_THRESHOLD = 50000;

export async function maybeSummarize(conversationId: string): Promise<boolean> {
  await connectDB();

  const conversation = await ConversationModel.findById(conversationId);
  if (!conversation) return false;
  if (conversation.totalTokens < TOKEN_THRESHOLD) return false;

  const activeMessages = conversation.messages.filter(
    (m: { isArchived: boolean }) => !m.isArchived
  );

  if (activeMessages.length < 4) return false;

  const toArchive = activeMessages.slice(0, -4);
  if (toArchive.length === 0) return false;

  const transcript = toArchive
    .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
    .join('\n');

  const response = await anthropic.messages.create({
    model: SUMMARIZE_MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Summarize the following conversation concisely, preserving key decisions, data points, and context that would be needed for the conversation to continue meaningfully:\n\n${transcript}`,
      },
    ],
  });

  const summary =
    response.content[0].type === 'text' ? response.content[0].text : '';

  const archiveIds = new Set(
    toArchive.map((m: { _id: { toString: () => string } }) => m._id.toString())
  );

  for (const msg of conversation.messages) {
    if (archiveIds.has(msg._id.toString())) {
      msg.isArchived = true;
    }
  }

  conversation.summary = summary;
  conversation.summarizedAt = new Date();

  await conversation.save();
  return true;
}
