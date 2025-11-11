import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserSchema, UserRole } from '../users/schemas/user.schema';

async function upsertUser(email: string, password: string, firstName: string, lastName: string, roles: UserRole[]) {
  const UserModel = mongoose.model<User & mongoose.Document>('User', UserSchema);
  const existing = await UserModel.findOne({ email }).exec();
  const hashed = await bcrypt.hash(password, 10);
  if (existing) {
    existing.password = hashed;
    existing.firstName = firstName;
    existing.lastName = lastName;
    existing.roles = roles;
    existing.isActive = true;
    await existing.save();
    console.log(`Updated user: ${email}`);
  } else {
    await UserModel.create({
      email,
      password: hashed,
      firstName,
      lastName,
      roles,
      isActive: true,
    });
    console.log(`Created user: ${email}`);
  }
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }
  await mongoose.connect(uri);

  await upsertUser('admin@spped.local', 'Passw0rd!', 'Admin', 'User', [UserRole.ADMIN]);
  await upsertUser('moderator@spped.local', 'Passw0rd!', 'Mod', 'Erator', [UserRole.MODERATOR]);
  await upsertUser('analyst@spped.local', 'Passw0rd!', 'Ana', 'Lyst', [UserRole.ANALYST]);
  await upsertUser('submitter@spped.local', 'Passw0rd!', 'Sub', 'Mitter', [UserRole.SUBMITTER]);

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


