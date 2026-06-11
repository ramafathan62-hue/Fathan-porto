import { PrismaClient } from './generated/prisma/client.js';
import pkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
