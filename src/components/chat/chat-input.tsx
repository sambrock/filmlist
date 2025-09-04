'use client';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useChatContext } from '@/providers/chat-context-provider';
import { useClientStore } from '@/providers/client-store-provider';
import { useApiSendChatMessage } from '@/hooks/use-api-send-chat-message';
import { Button } from '../common/button';
import { ChatModelSelect } from './chat-model-select';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const { chatId } = useChatContext();

  const { inputValue } = useClientStore((store) => store.chat(chatId)!);
  const dispatch = useClientStore((store) => store.dispatch);

  const sendChatMessage = useApiSendChatMessage();

  return (
    <div
      className={cn('border-foreground-0/5 bg-background-2 flex flex-col rounded-xl border px-2', className)}
      {...props}
    >
      <textarea
        className="text-foreground-0 placeholder:text-foreground-0/35 my-2 w-full resize-none px-2 py-2 text-base focus:outline-none"
        placeholder="Type your message..."
        rows={1}
        value={inputValue}
        autoFocus
        onChange={(e) =>
          dispatch({
            type: 'CHAT_MESSAGE_INPUT',
            payload: { chatId, value: e.target.value },
          })
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            sendChatMessage.mutate(inputValue);
          }
        }}
      />

      <div className="flex items-center gap-1 py-1 pb-1">
        <ChatModelSelect />
        <Button className="ml-auto" size="icon" variant="ghost">
          <ArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
};
