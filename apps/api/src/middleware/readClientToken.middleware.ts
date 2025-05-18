import { createMiddleware } from 'hono/factory';

import { COOKIE_CLIENT_TOKEN } from '@repo/lib/constants';
import { verifyClientToken } from '@repo/lib/utils/client';
import { AppBindings } from '@/lib/config';

export const readClientToken = createMiddleware<AppBindings>(async (c, next) => {
  const clientToken = c.req.header(COOKIE_CLIENT_TOKEN);
  if (clientToken) {
    const payload = verifyClientToken(clientToken, c.env.JWT_SECRET);
    if (payload) {
      c.set('clientId', payload.clientId);
      return next();
    }
  }

  c.set('clientId', '');
  return next();
});
