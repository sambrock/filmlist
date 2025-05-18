import { setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { COOKIE_CLIENT_TOKEN } from '@repo/lib/constants';
import { generateClientId, verifyClientToken, signClientToken } from '@repo/lib/utils/client';
import { AppBindings } from '@/lib/config';

export const initializeClientMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const clientToken = c.req.header(COOKIE_CLIENT_TOKEN);

  if (clientToken) {
    const payload = verifyClientToken(clientToken, c.env.JWT_SECRET);
    if (!payload) {
      return c.json({}, 401);
    }

    c.set('clientId', payload.clientId);

    return next();
  }

  const clientId = generateClientId();

  const signedToken = signClientToken({ clientId }, c.env.JWT_SECRET);

  c.res.headers.set('Access-Control-Allow-Credentials', 'true');
  c.res.headers.set(COOKIE_CLIENT_TOKEN, signedToken);
  setCookie(c, COOKIE_CLIENT_TOKEN, signedToken, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  });

  c.set('clientId', clientId);

  return next();
});
