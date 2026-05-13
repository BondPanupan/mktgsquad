import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import AgentModel from '@/models/Agent';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const agents = await AgentModel.find({}).sort({ agentId: 1 });
  return Response.json(agents);
}
