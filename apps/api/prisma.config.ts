import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  datasource: {
    // Production: Turso cloud | Development: local SQLite
    url: process.env.TURSO_DATABASE_URL ?? 'file:./dev.db',
  },
});
