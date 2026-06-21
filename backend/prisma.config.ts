import { defineConfig } from '@prisma/config';

export default defineConfig({
    datasource: {
        url: (globalThis as any).process?.env?.DATABASE_URL ?? 'file:./prisma/dev.db', // <- Hier das "./prisma/" ergänzen
    },
});