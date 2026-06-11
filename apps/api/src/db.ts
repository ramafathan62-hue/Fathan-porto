import { PrismaClient } from './generated/prisma/client.js';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Production: Turso cloud DB | Development: local SQLite file
const url = process.env.TURSO_DATABASE_URL ?? `file:${resolve(__dirname, '../dev.db')}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });
const adapter = new PrismaLibSQL(client);

export const prisma = new PrismaClient({ adapter });
