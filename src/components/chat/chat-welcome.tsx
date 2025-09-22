'use client';

import { useQuery } from 'convex/react';

import { api } from '@/infra/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useThreadContext } from '@/providers/thread-context-provider';
import { useApiSendMessage } from '@/hooks/use-api-send-message';

type Props = { initialActive: boolean } & React.ComponentProps<'div'>;

const EXAMPLE_MESSAGES = [
  "Recommend me a hidden gem I probably haven't seen",
  'I want a mind-bending thriller with a twist ending',
  'Suggest a cozy movie for a rainy day',
  'New York City in the 80s',
];

export const ChatWelcome = ({ initialActive, className, ...props }: Props) => {
  const { threadId } = useThreadContext();

  const isActive = useQuery(api.messages.getByThreadId, { threadId })?.length === 0 || initialActive;
  const isPending = useGlobalStore((s) => s.chatPending.has(threadId) || s.chatPending.has('new'));
  const isInput =
    useGlobalStore((s) => s.chatInputValue.get(threadId) || s.chatInputValue.get('new') || '').length > 0;

  const sendMessage = useApiSendMessage();

  if (!isActive || isInput || isPending) {
    return null;
  }
  return (
    <div className={cn('flex flex-col justify-center px-6', className)} {...props}>
      <h1 className="text-foreground-0/90 mb-6 text-2xl font-bold antialiased">
        What do you feel like watching today?
      </h1>

      <ul className="flex flex-col">
        {EXAMPLE_MESSAGES.map((message, i) => (
          <li key={i} className="border-foreground-0/5 border-b py-2 last:border-0">
            <button
              className="text-foreground-1 hover:bg-foreground-0/5 w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium transition"
              onClick={() => sendMessage.mutate(message)}
            >
              {message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

{
  /* <li className="border-foreground-0/5 border-b py-1 text-base">
          <button
            className="text-foreground-1 px-3 py-2 text-sm font-medium"
            onClick={() => sendMessage("Recommend me a hidden gem I probably haven't seen")}
          >
            Recommend me a hidden gem I probably haven't seen
          </button>
        </li>
        <li className="border-foreground-0/5 border-b py-1 text-base">
          <div className="text-foreground-1 px-3 py-2 text-sm font-medium">
            I want a mind-bending thriller with a twist ending
          </div>
        </li>
        <li className="border-foreground-0/5 border-b py-1 text-base">
          <div className="text-foreground-1 px-3 py-2 text-sm font-medium">
            Suggest a cozy movie for a rainy day
          </div>
        </li>
        <li className="py-1 text-base">
          <div className="text-foreground-1 px-3 py-2 text-sm font-medium">
            Pick a random underrated indie film for me
          </div>
        </li> */
}
