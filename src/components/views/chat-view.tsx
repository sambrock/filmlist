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
      <main>
        <div className="relative mx-auto grid w-full grid-rows-[calc(100vh-20px)_20px]">
          <div className="mx-auto w-full overflow-y-scroll p-3">
            <ChatMessages
              className="mx-auto lg:w-3xl"
              initialData={preloadedQueryResult(preloadedMessagesQuery)}
            />
          </div>

          <div className="mx-auto -mt-26 w-full p-3">
            <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
          </div>
        </div>

        {/* <div className="bg-background-1 fixed bottom-0 h-10 w-full"></div> */}
      </main>
    </ThreadContextProvider>
  );
};
