import 'dotenv/config';
import mongoose from 'mongoose';
import { User, UserSchema, UserRole } from '../users/schemas/user.schema';
import { Article, ArticleSchema, ArticleStatus } from '../articles/schemas/article.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const UserModel = mongoose.model<User & mongoose.Document>('User', UserSchema);
  const ArticleModel = mongoose.model<Article & mongoose.Document>('Article', ArticleSchema);

  const users: Array<{ email: string; password: string; firstName: string; lastName: string; roles: UserRole[]; }> = [
    { email: 'admin@spped.local', password: 'Passw0rd!', firstName: 'Admin', lastName: 'User', roles: [UserRole.ADMIN] },
    { email: 'moderator@spped.local', password: 'Passw0rd!', firstName: 'Mod', lastName: 'Erator', roles: [UserRole.MODERATOR] },
    { email: 'analyst@spped.local', password: 'Passw0rd!', firstName: 'Ana', lastName: 'Lyst', roles: [UserRole.ANALYST] },
    { email: 'submitter@spped.local', password: 'Passw0rd!', firstName: 'Sub', lastName: 'Mitter', roles: [UserRole.SUBMITTER] },
  ];

  console.log('Seeding users...');
  const createdUsers: Record<string, any> = {};
  for (const u of users) {
    const found = await UserModel.findOne({ email: u.email }).exec();
    if (found) {
      createdUsers[u.email] = found;
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    const doc = await UserModel.create({
      email: u.email,
      password: hashed,
      firstName: u.firstName,
      lastName: u.lastName,
      roles: u.roles,
      isActive: true,
    });
    createdUsers[u.email] = doc;
  }

  console.log('Seeding articles...');
  const submitter = createdUsers['submitter@spped.local']._id;
  const samples: Array<Partial<Article>> = [
    {
      title: 'Test-Driven Development in Practice',
      authors: ['Jane Doe', 'John Smith'],
      publicationYear: 2020,
      doi: '10.1000/tdd.2020.001',
      journalName: 'Journal of SE',
      submittedBy: submitter,
      status: ArticleStatus.PENDING_REVIEW,
      abstract: 'A study on TDD impacts.',
    },
    {
      title: 'Code Review Effectiveness Study',
      authors: ['Alice Lee'],
      publicationYear: 2019,
      doi: '10.1000/review.2019.002',
      journalName: 'Empirical SE',
      submittedBy: submitter,
      status: ArticleStatus.PENDING_ANALYSIS,
      abstract: 'Review practices and findings.',
    },
    {
      title: 'Continuous Integration Benefits',
      authors: ['Bob Chen'],
      publicationYear: 2021,
      journalName: 'Software Practice',
      submittedBy: submitter,
      status: ArticleStatus.APPROVED,
      abstract: 'CI benefits in teams.',
    },
  ];

  for (const a of samples) {
    const exists = await ArticleModel.findOne({ title: a.title }).exec();
    if (exists) continue;
    await ArticleModel.create(a);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


