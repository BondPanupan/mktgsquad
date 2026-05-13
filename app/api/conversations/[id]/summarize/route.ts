import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { maybeSummarize } from '@/lib/summarize';
import ConversationModel from '@/models/Conversation';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const conversation = await ConversationModel.findOne({
    _id: id,
    userId: session.user.id,
  });

  if (!conversation) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const summarized = await maybeSummarize(id);

  return Response.json({ summarized });
}
