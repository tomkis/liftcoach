import type { Config } from 'drizzle-kit'

export default {
  schema: './mobile/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config
