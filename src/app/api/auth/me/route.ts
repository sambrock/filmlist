import { getAuthTokenCookie, setAuthTokenCookie, verifyAuthToken } from '@/lib/auth';
import { generateUuid } from '@/lib/utils';

export const GET = async () => {
  const authToken = await getAuthTokenCookie();
  if (authToken) {
    const user = verifyAuthToken(authToken);
    if (user) {
      return Response.json(user);
    }
  }

  const anonUser = { userId: generateUuid(), anon: true };
  await setAuthTokenCookie(anonUser);

  return Response.json(anonUser);
};
