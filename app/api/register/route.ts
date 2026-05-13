import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import UserModel from '@/models/User';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return Response.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await UserModel.findOne({ email: email.toLowerCase() });
  if (existing) {
    return Response.json({ error: 'Email already in use' }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await UserModel.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashed,
  });

  return Response.json({ success: true }, { status: 201 });
}
