import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;

async function reset() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db!;
  const collections = await db.listCollections().toArray();

  for (const col of collections) {
    await db.dropCollection(col.name);
    console.log(`Dropped: ${col.name}`);
  }

  await mongoose.disconnect();
  console.log('Reset complete — all collections dropped');
}

reset().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
