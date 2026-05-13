import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import UsageStatModel from '@/models/UsageStat';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') ?? '30', 10);

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().slice(0, 10);

  await connectDB();

  const stats = await UsageStatModel.find({
    userId: session.user.id,
    date: { $gte: sinceStr },
  }).sort({ date: -1 });

  return Response.json(stats);
}
