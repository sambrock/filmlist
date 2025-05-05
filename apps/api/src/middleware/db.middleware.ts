import { createMiddleware } from 'hono/factory';

import { initDrizzleDatabase } from '@repo/drizzle';
import { AppBindings } from '@/lib/config';

export const dbMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  if (!c.env.db) {
    c.env.db = initDrizzleDatabase(c.env.DB);
  }

  await next();
});
