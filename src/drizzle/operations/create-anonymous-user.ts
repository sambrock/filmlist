import { db } from '../db';
import { users } from '../schema';
import { UserInsert } from '../zod';

export const createAnonymousUser = async (data: UserInsert) => {
  const [user] = await db
    .insert(users)
    .values({
      ...data,
      userId: data.userId.replace('anon:', ''),
    })
    .returning()
    .onConflictDoNothing();

  return user;
};
