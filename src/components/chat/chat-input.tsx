'use client';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { clearUuid } from '@/lib/utils/uuid';
import { useChatContext } from '@/providers/chat-context-provider';
import { useClientStore } from '@/providers/client-store-provider';
import { useSendChatMessage } from '@/hooks/use-send-chat-message';
import { Button } from '../common/button';
import { ChatModelSelect } from './chat-model-select';

type Props = {} & React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const { chatId } = useChatContext();

  const { value } = useClientStore((store) => store.actions.getChat(chatId));
  const updateChat = useClientStore((store) => store.actions.updateChat);

  const sendChatMessage = useSendChatMessage();

  const handleSubmit = () => {
    sendChatMessage.mutate(value);
    window.history.pushState({}, '', `/chat/${clearUuid(chatId)}`);
  };

  return (
    <div
      className={cn('border-foreground-0/5 bg-background-2 flex flex-col rounded-xl border px-2', className)}
      {...props}
    >
      <textarea
        className="text-foreground-0 placeholder:text-foreground-0/35 my-2 w-full resize-none px-2 py-2 text-base focus:outline-none"
        placeholder="Type your message..."
        rows={1}
        value={value}
        autoFocus
        onChange={(e) => updateChat(chatId, { value: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            e.preventDefault();
            handleSubmit();
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
