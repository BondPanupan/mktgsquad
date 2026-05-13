import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import ConversationModel from '@/models/Conversation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const conversation = await ConversationModel.findOne(
    { _id: id, userId: session.user.id },
    { messages: 1, summary: 1, summarizedAt: 1 }
  );

  if (!conversation) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({
    messages: conversation.messages,
    summary: conversation.summary,
    summarizedAt: conversation.summarizedAt,
  });
}
