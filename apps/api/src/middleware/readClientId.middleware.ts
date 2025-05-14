import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';

import { AppBindings } from '@/lib/config';

export const readClientId = createMiddleware<AppBindings>(async (c, next) => {
  const clientToken = c.req.header('client-token');

  // TODO: better error messages
  if (!clientToken) {
    return c.json({}, 400);
  }

  if (clientToken) {
    const { clientId } = await verify(clientToken, c.env.JWT_SECRET);
    if (!clientId) {
      return c.json({}, 400);
    }

    c.set('clientId', clientId as string);

    return next();
  }
});
