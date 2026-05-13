import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import anthropic, { CHAT_MODEL } from '@/lib/anthropic';
import { buildContext } from '@/lib/context';
import { maybeSummarize } from '@/lib/summarize';
import { generateTitle } from '@/lib/utils';
import ConversationModel from '@/models/Conversation';
import UsageStatModel from '@/models/UsageStat';
import { agentMap } from '@/agents';
import type { ChatRequest } from '@/types';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: ChatRequest = await request.json();
  const { conversationId, message, agentId } = body;

  if (!conversationId || !message || !agentId) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const agent = agentMap[agentId];
  if (!agent) {
    return Response.json({ error: 'Invalid agent' }, { status: 400 });
  }

  await connectDB();

  const conversation = await ConversationModel.findOne({
    _id: conversationId,
    userId: session.user.id,
  });

  if (!conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  conversation.messages.push({
    role: 'user',
    content: message,
    tokensUsed: 0,
    model: '',
    isArchived: false,
    createdAt: new Date(),
  } as any);

  if (
    conversation.title === 'New Conversation' &&
    conversation.messages.length === 1
  ) {
    conversation.title = generateTitle(message);
  }

  const contextMessages = buildContext(
    conversation.messages.map((m: any) => ({
      _id: m._id.toString(),
      role: m.role,
      content: m.content,
      tokensUsed: m.tokensUsed,
      model: m.model,
      isArchived: m.isArchived,
      createdAt: m.createdAt?.toISOString() ?? new Date().toISOString(),
    })),
    conversation.summary
  );

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const anthropicStream = await anthropic.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 4096,
          system: agent.systemPrompt,
          messages: contextMessages,
        });

        let fullContent = '';
        let inputTokens = 0;
        let outputTokens = 0;

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            fullContent += chunk.delta.text;
            const data = JSON.stringify({
              type: 'delta',
              content: chunk.delta.text,
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          if (chunk.type === 'message_delta' && chunk.usage) {
            outputTokens = chunk.usage.output_tokens;
          }

          if (chunk.type === 'message_start' && chunk.message.usage) {
            inputTokens = chunk.message.usage.input_tokens;
          }
        }

        const totalTokens = inputTokens + outputTokens;

        conversation.messages.push({
          role: 'assistant',
          content: fullContent,
          tokensUsed: totalTokens,
          model: CHAT_MODEL,
          isArchived: false,
          createdAt: new Date(),
        } as any);

        conversation.totalTokens = (conversation.totalTokens || 0) + totalTokens;
        await conversation.save();

        const today = new Date().toISOString().slice(0, 10);
        await UsageStatModel.findOneAndUpdate(
          { userId: session.user.id, agentId, date: today },
          { $inc: { messagesCount: 1, tokensUsed: totalTokens } },
          { upsert: true }
        );

        const done = JSON.stringify({ type: 'done', tokensUsed: totalTokens });
        controller.enqueue(encoder.encode(`data: ${done}\n\n`));
        controller.close();

        maybeSummarize(conversationId).catch(() => {});
      } catch (err) {
        const error = JSON.stringify({
          type: 'error',
          error: err instanceof Error ? err.message : 'Stream error',
        });
        controller.enqueue(encoder.encode(`data: ${error}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
