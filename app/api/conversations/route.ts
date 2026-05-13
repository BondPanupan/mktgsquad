import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import ConversationModel from '@/models/Conversation';
import type { AgentId } from '@/types';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const conversations = await ConversationModel.find(
    { userId: session.user.id },
    { messages: 0 }
  ).sort({ updatedAt: -1 });

  return Response.json(conversations);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { agentId }: { agentId: AgentId } = await request.json();

  if (!agentId) {
    return Response.json({ error: 'agentId is required' }, { status: 400 });
  }

  await connectDB();

  const conversation = await ConversationModel.create({
    userId: session.user.id,
    agentId,
    title: 'New Conversation',
    messages: [],
    totalTokens: 0,
  });

  return Response.json(conversation, { status: 201 });
}
