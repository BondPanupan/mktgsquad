import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import AgentModel from '@/models/Agent';
import { agents as agentDefs } from '@/agents';
import Topbar from '@/components/ui/Topbar';
import AgentSidebar from '@/components/agents/AgentSidebar';
import type { IAgent } from '@/types';
import styles from './dashboard.module.css';

async function ensureAgentsSeeded() {
  await connectDB();
  const count = await AgentModel.countDocuments();
  if (count === 0) {
    await AgentModel.insertMany(
      agentDefs.map((a) => ({
        agentId: a.id,
        name: a.name,
        role: a.role,
        color: a.color,
        description: a.description,
        isActive: true,
      }))
    );
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  await ensureAgentsSeeded();

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

  return (
    <div className={styles.shell}>
      <Topbar userName={session.user.name} />
      <div className={styles.body}>
        <AgentSidebar agents={agents} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
