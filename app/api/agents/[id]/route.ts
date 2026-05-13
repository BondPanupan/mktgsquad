import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import AgentModel from '@/models/Agent';
import type { AgentId } from '@/types';

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

  const agent = await AgentModel.findOne({ agentId: id as AgentId });
  if (!agent) {
    return Response.json({ error: 'Agent not found' }, { status: 404 });
  }

  return Response.json(agent);
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
  const { isActive }: { isActive: boolean } = await request.json();

  await connectDB();

  const agent = await AgentModel.findOneAndUpdate(
    { agentId: id as AgentId },
    { isActive },
    { new: true }
  );

  if (!agent) {
    return Response.json({ error: 'Agent not found' }, { status: 404 });
  }

  return Response.json(agent);
}
