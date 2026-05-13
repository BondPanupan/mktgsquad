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

  const conversation = await ConversationModel.findOne({
    _id: id,
    userId: session.user.id,
  });

  if (!conversation) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(conversation);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { title }: { title: string } = await request.json();

  await connectDB();

  const conversation = await ConversationModel.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { title },
    { new: true, select: '-messages' }
  );

  if (!conversation) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(conversation);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const result = await ConversationModel.deleteOne({
    _id: id,
    userId: session.user.id,
  });

  if (result.deletedCount === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({ success: true });
}
