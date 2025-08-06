import { uuid } from '@/lib/utils';
import { db } from '../db';
import { messages } from '../schema';

export const createPendingUserAssistantMessages = async (
  threadId: string,
  model: string,
  userMessageContent: string
) => {
  const userMessageId = uuid();

  const [userMessage, assistantMessage] = await db
    .insert(messages)
    .values([
      {
        messageId: userMessageId,
        threadId,
        content: userMessageContent,
        model,
        role: 'user',
        status: 'pending',
      },
      {
        messageId: uuid(),
        threadId,
        parentId: userMessageId,
        content: '',
        model,
        role: 'assistant',
        status: 'pending',
      },
    ])
    .returning();

  return [userMessage, assistantMessage];
};
