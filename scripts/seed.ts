import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;

const agentDefs = [
  {
    agentId: 'apex',
    name: 'APEX',
    role: 'Performance Marketing Manager',
    color: '#E8445A',
    description:
      'Strategic performance marketing lead. Drives ROI across paid channels, owns budget allocation, and orchestrates cross-channel campaign strategy.',
    isActive: true,
  },
  {
    agentId: 'bolt',
    name: 'BOLT',
    role: 'Google Ads / SEM Specialist',
    color: '#4285F4',
    description:
      'Google Ads expert. Manages search, shopping, Performance Max, and YouTube campaigns with deep expertise in bidding, Quality Score, and keyword strategy.',
    isActive: true,
  },
  {
    agentId: 'pixel',
    name: 'PIXEL',
    role: 'MarTech / GTM / Tracking Specialist',
    color: '#FF6D00',
    description:
      'Marketing technology and tracking expert. Implements and audits GTM, GA4, pixel setups, and data layer architecture to ensure accurate measurement.',
    isActive: true,
  },
  {
    agentId: 'rank',
    name: 'RANK',
    role: 'SEO Specialist',
    color: '#00C853',
    description:
      'SEO strategist and technical expert. Grows organic traffic through technical audits, content strategy, link building, and search intent optimization.',
    isActive: true,
  },
  {
    agentId: 'pulse',
    name: 'PULSE',
    role: 'Email Marketing / CRM Specialist',
    color: '#AA00FF',
    description:
      'Email marketing and CRM expert. Builds lifecycle programs, optimizes deliverability, and drives retention through personalized automation flows.',
    isActive: true,
  },
  {
    agentId: 'forge',
    name: 'FORGE',
    role: 'Web / Landing Page Developer',
    color: '#00BCD4',
    description:
      'Front-end developer specializing in high-converting landing pages. Combines conversion rate optimization expertise with clean, performant code.',
    isActive: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const AgentSchema = new mongoose.Schema({
    agentId: String,
    name: String,
    role: String,
    color: String,
    description: String,
    isActive: Boolean,
  });

  const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
  });

  const Agent = mongoose.models.Agent ?? mongoose.model('Agent', AgentSchema);
  const User = mongoose.models.User ?? mongoose.model('User', UserSchema);

  await Agent.deleteMany({});
  await Agent.insertMany(agentDefs);
  console.log(`Seeded ${agentDefs.length} agents`);

  const existingDemo = await User.findOne({ email: 'demo@mktgsquad.com' });
  if (!existingDemo) {
    await User.create({
      name: 'Demo User',
      email: 'demo@mktgsquad.com',
      password: await bcrypt.hash('password123', 12),
    });
    console.log('Created demo user: demo@mktgsquad.com / password123');
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
