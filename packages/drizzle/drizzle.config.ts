import { defineConfig } from 'drizzle-kit';

import 'dotenv/config';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schema/**/*.schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: '../../apps/api/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/904811132f1ecc5c6e5af0327802cf34a70358d8e9020c564955f7661f41b9d6.sqlite'
  }
});
