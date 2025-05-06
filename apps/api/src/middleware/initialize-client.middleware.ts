import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { decode, sign } from 'hono/jwt';

import { AppBindings } from '@/lib/config';
import { generateNanoid } from '@/lib/utils';

export const initializeClientMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const accessToken = getCookie(c, 'access-token');

  if (accessToken) {
    const decoded = decode(accessToken);
    if (!decoded) {
      return c.json({}, 401);
    }

    c.set('clientId', decoded.payload.clientId as string);

    return next();
  }

  const clientId = generateNanoid();
  const signedToken = await sign({ clientId }, c.env.JWT_SECRET);

  c.res.headers.set('Access-Control-Allow-Credentials', 'true');
  c.res.headers.set('access-token', signedToken);
  setCookie(c, 'access-token', signedToken, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  });

  c.set('clientId', clientId);

  return next();
});
