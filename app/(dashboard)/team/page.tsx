import { connectDB } from '@/lib/mongodb';
import AgentModel from '@/models/Agent';
import TeamOverview from '@/components/agents/TeamOverview';
import type { IAgent } from '@/types';

export default async function TeamPage() {
  await connectDB();
  const agents: IAgent[] = (await AgentModel.find({})).map((a) => ({
    _id: a._id.toString(),
    agentId: a.agentId,
    name: a.name,
    role: a.role,
    color: a.color,
    description: a.description,
    isActive: a.isActive,
  }));

  return <TeamOverview agents={agents} />;
}
