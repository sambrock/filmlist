import { uuid } from '@/lib/utils';
import { db } from '../db';
import { users } from '../schema';

export const createAnonymousUser = async () => {
  const [user] = await db
    .insert(users)
    .values({
      userId: uuid(),
      anon: true,
    })
    .returning();

  return user;
};
