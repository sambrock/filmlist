import { defineConfig } from 'drizzle-kit';

import 'dotenv/config';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schema/**/*.schema.ts',
  out: './drizzle',
});
