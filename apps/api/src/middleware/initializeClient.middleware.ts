import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { decode, sign, verify } from 'hono/jwt';

import { AppBindings } from '@/lib/config';
import { generateNanoid } from '@/lib/utils';

export const initializeClientMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const clientToken = getCookie(c, 'client-token');

  if (clientToken) {
    const { clientId } = await verify(clientToken, c.env.JWT_SECRET);
    if (!clientId) {
      return c.json({}, 401);
    }

    c.set('clientId', clientId as string);

    return next();
  }

  const clientId = generateNanoid();
  const signedToken = await sign({ clientId }, c.env.JWT_SECRET);

  c.res.headers.set('Access-Control-Allow-Credentials', 'true');
  c.res.headers.set('client-token', signedToken);
  setCookie(c, 'client-token', signedToken, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  });

  c.set('clientId', clientId);

  return next();
});
