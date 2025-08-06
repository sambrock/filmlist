import { eq } from 'drizzle-orm';

import { db } from '../db';
import { messages } from '../schema';
import { Message } from '../zod';

export const updateMessage = (messageId: string, updates: Partial<Message>) => {
  return db.update(messages).set(updates).where(eq(messages.messageId, messageId));
};
