// import 'server-only';

// import { cache } from 'react';
// import { cookies } from 'next/headers';
// import * as jwt from 'jsonwebtoken';

// import { env } from './env';

// const AUTH_TOKEN_COOKIE_NAME = 'auth-token';

// export const generateAuthToken = (user: User) => {
//   return jwt.sign(user, env.JWT_SECRET);
// };

// export const verifyAuthToken = cache((token: string): User | null => {
//   const user = jwt.verify(token, env.JWT_SECRET);
//   if (user) {
//     return user as User;
//   }

//   return null;
// });

// export const getAuthTokenCookie = async () => {
//   const cookieStore = await cookies();
//   const authTokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
//   if (!authTokenCookie) {
//     return null;
//   }

//   return authTokenCookie.value;
// };

// export const setAuthTokenCookie = async (user: User) => {
//   const cookieStore = await cookies();
//   const token = generateAuthToken(user);
//   cookieStore.set(AUTH_TOKEN_COOKIE_NAME, token, {
//     path: '/',
//     httpOnly: true,
//     sameSite: 'lax',
//     // secure: true,
//   });
// };
