import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const dbPath = process.env.DATABASE_URL ?? `file:${path.resolve(process.cwd(), 'prisma/dev.db')}`;

const adapter = new PrismaBetterSqlite3({
  url: dbPath,
});

const prisma = new PrismaClient({ adapter });

export default prisma;