import { setCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';

import { AppRouteHandler } from '@/lib/openapi';
import { generateNanoid } from '@/lib/utils';

import { InitializeClientRoute } from '../auth.routes';

export const initializeClient: AppRouteHandler<InitializeClientRoute> = async (c) => {
  const clientId = generateNanoid();
  const signedToken = await sign({ clientId }, c.env.JWT_SECRET);

  c.res.headers.set('Access-Control-Allow-Credentials', 'true');

  setCookie(c, 'access-token', signedToken, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  });

  return c.json({ clientId: clientId });
};
