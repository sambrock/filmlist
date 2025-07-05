'use client';

import { cn } from '@/lib/utils/app.utils';
import { useChatActions, useChatInputValue } from '@/providers/chat-store-provider';
import { useSendMessageMutation } from '@/hooks/useSendChatMessage.mutation';
import { ChatInputButtonSend } from './chat-input-button-send';
import { ChatInputControl } from './chat-input-control';
import { ChatInputDropdownModel } from './chat-input-dropdown-model';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const value = useChatInputValue();
  const { updateChat, initMessage } = useChatActions();

  const sendMutation = useSendMessageMutation();

  const handleSendMessage = () => {
    const key = initMessage();
    sendMutation.mutate(key);
  };

  return (
    <div
      className={cn('bg-background-2 w-3xl rounded-xl px-2 py-2 shadow-md shadow-black/20', className)}
      {...props}
    >
      <ChatInputControl
        className="placeholder:text-text-primary/50 rounded-lg bg-transparent px-3 py-2 pb-3 focus:outline-none"
        placeholder="Ask anything"
        value={value}
        onChange={(e) => {
          updateChat({ inputValue: e.target.value });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />

      <div className="flex items-center px-1">
        <ChatInputDropdownModel />

        <ChatInputButtonSend
          className="ml-auto"
          onClick={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        />
      </div>
    </div>
  );
};
