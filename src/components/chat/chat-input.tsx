'use client';

import { cn } from '@/lib/utils/cn';
import { generateUuid } from '@/lib/utils/uuid';
import { useChatStore } from '@/providers/chat-store-provider';
import { useSendMessageMutation } from '@/hooks/api/useSendMessageMutation';
import { ChatInputButtonSend } from './chat-input-button-send';
import { ChatInputControl } from './chat-input-control';
import { ChatInputSelectModel } from './chat-input-select-model';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const [threadId, threadExists, value, model, setThreadExists, setValue] = useChatStore((state) => [
    state.threadId,
    state.threadExists,
    state.inputValue,
    state.model,
    state.setThreadExists,
    state.setInputValue,
  ]);

  const sendMessageMutation = useSendMessageMutation();

  const handleSendMessage = async () => {
    sendMessageMutation.mutate({
      messageId: generateUuid(),
      threadId,
      content: value,
      model,
      threadExists,
    });
    setThreadExists(true);
  };

  return (
    <div
      className={cn(
        'bg-surface-3/30 border-border-1 rounded-2xl border px-3 py-3 backdrop-blur-md',
        className
      )}
      {...props}
    >
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
