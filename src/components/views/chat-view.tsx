import { preloadedQueryResult, preloadQuery } from 'convex/nextjs';

import { api } from '@/infra/convex/_generated/api';
import { ThreadContextProvider } from '@/providers/thread-context-provider';
import { ChatInput } from '../chat/chat-input';
import { ChatMessages } from '../chat/chat-messages';

type Props = {
  threadId: string;
  isPersisted: boolean;
};

export const ChatView = async ({ threadId, isPersisted }: Props) => {
  const preloadedMessagesQuery = await preloadQuery(api.messages.getByThreadId, { threadId });

  return (
    <ThreadContextProvider threadId={threadId} isPersisted={isPersisted}>
      <main className="h-screen overflow-y-auto outline-none">
        <div className="relative mx-auto w-3xl">
          <ChatMessages initialData={preloadedQueryResult(preloadedMessagesQuery)} />
          <ChatInput className="fixed bottom-4 z-10 w-3xl shadow-xl shadow-black/10" />
        </div>

        <div className="bg-background-1 fixed bottom-0 h-10 w-full"></div>
      </main>
    </ThreadContextProvider>
  );
};
