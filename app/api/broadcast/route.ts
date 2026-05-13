import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import anthropic, { CHAT_MODEL } from '@/lib/anthropic';
import BroadcastSessionModel from '@/models/BroadcastSession';
import { agentMap } from '@/agents';
import type { BroadcastRequest, AgentId } from '@/types';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: BroadcastRequest = await request.json();
  const { prompt, agentIds } = body;

  if (!prompt || !agentIds?.length) {
    return Response.json(
      { error: 'prompt and agentIds are required' },
      { status: 400 }
    );
  }

  await connectDB();

  const session_doc = await BroadcastSessionModel.create({
    userId: session.user.id,
    prompt,
    agentIds,
    responses: [],
    status: 'running',
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for (const agentId of agentIds) {
          const agent = agentMap[agentId as AgentId];
          if (!agent) continue;

          let content = '';
          let tokensUsed = 0;

          const startData = JSON.stringify({ type: 'agent_start', agentId });
          controller.enqueue(encoder.encode(`data: ${startData}\n\n`));

          const agentStream = await anthropic.messages.stream({
            model: CHAT_MODEL,
            max_tokens: 2048,
            system: agent.systemPrompt,
            messages: [{ role: 'user', content: prompt }],
          });

          for await (const chunk of agentStream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              content += chunk.delta.text;
              const deltaData = JSON.stringify({
                type: 'delta',
                agentId,
                content: chunk.delta.text,
              });
              controller.enqueue(encoder.encode(`data: ${deltaData}\n\n`));
            }
            if (chunk.type === 'message_delta' && chunk.usage) {
              tokensUsed = chunk.usage.output_tokens;
            }
          }

          session_doc.responses.push({
            agentId: agentId as AgentId,
            content,
            tokensUsed,
            completedAt: new Date(),
          });

          const doneData = JSON.stringify({
            type: 'agent_done',
            agentId,
            tokensUsed,
          });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
        }

        session_doc.status = 'completed';
        await session_doc.save();

        const finishData = JSON.stringify({
          type: 'broadcast_done',
          sessionId: session_doc._id.toString(),
        });
        controller.enqueue(encoder.encode(`data: ${finishData}\n\n`));
        controller.close();
      } catch (err) {
        session_doc.status = 'failed';
        await session_doc.save().catch(() => {});

        const errorData = JSON.stringify({
          type: 'error',
          error: err instanceof Error ? err.message : 'Broadcast error',
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
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

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const sessions = await BroadcastSessionModel.find(
    { userId: session.user.id },
    { responses: 0 }
  )
    .sort({ createdAt: -1 })
    .limit(20);

  return Response.json(sessions);
}
