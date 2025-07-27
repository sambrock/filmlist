import { NextRequest } from 'next/server';

import { generateAuthToken } from '@/lib/auth';
import { db, users } from '@/lib/drizzle';
import { generateUuid } from '@/lib/utils';

export const POST = async (req: NextRequest) => {
  const cookieToken = req.cookies.get('access_token');

  if (cookieToken && cookieToken.value) {
    return new Response('Initialized', { status: 200 });
  }

  const userId = generateUuid();

  await db.insert(users).values({
    userId,
    anon: true,
  });

  const token = generateAuthToken({
    userId,
    anon: true,
  });

  const response = new Response('Initialized', { status: 200 });
  response.headers.set('Set-Cookie', `access_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`);

  return response;
};
