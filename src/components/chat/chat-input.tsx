'use client';

import { cn } from '@/lib/utils/cn';
import { useChatStore } from '@/providers/chat-store-provider';
import { useSendMessageMutation } from '@/hooks/api/useSendMessageMutation';
import { ChatInputButtonSend } from './chat-input-button-send';
import { ChatInputControl } from './chat-input-control';
import { ChatInputSelectModel } from './chat-input-select-model';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const [value, setValue] = useChatStore((state) => [state.inputValue, state.actions.setInputValue]);

  const sendMutation = useSendMessageMutation();

  const handleSendMessage = () => {
    sendMutation.mutate();
  };

  return (
    <div className={cn('bg-surface-2/95 backdrop-blur-md rounded-2xl px-3 py-3', className)} {...props}>
      <ChatInputControl
        className="placeholder:text-text-primary/50 rounded-lg bg-transparent px-3 py-2 pb-4 focus:outline-none"
        placeholder="Ask anything"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />

      <div className="flex items-center">
        <ChatInputSelectModel />

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
