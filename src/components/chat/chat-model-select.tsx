'use client';

import { ChevronDown } from 'lucide-react';
import { useIsClient } from 'usehooks-ts';

import { models } from '@/lib/models';
import { cn } from '@/lib/utils/cn';
import { useChatContext } from '@/providers/chat-context-provider';
import { useChatStore } from '@/providers/chat-store-provider';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';

export const ChatModelSelect = () => {
  const { chatId } = useChatContext();
  const [selectedModel, updateChat] = useChatStore((store) => [
    store.actions.getChat(chatId).model,
    store.actions.updateChat,
  ]);

  const isClient = useIsClient();

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }
  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button className="text-sm" size="sm" variant="ghost">
          {models.get(selectedModel)!.name}
          <ChevronDown className="size-5" />
        </Button>
      </DropdownTrigger>
      <DropdownContent className="min-w-80" align="start" sideOffset={2}>
        {[...models.values()]
          .filter((model) => model.active)
          .map((model) => (
            <DropdownItem
              key={model.id}
              className={cn(model.id === selectedModel && 'bg-background-1/50')}
              onClick={() => updateChat(chatId, { model: model.id })}
            >
              <div className="flex items-end gap-3">
                <span className="font-medium">{model.name}</span>
                <span className="text-foreground-1 ml-auto w-14 text-right text-xs">{model.provider}</span>
              </div>
            </DropdownItem>
          ))}
      </DropdownContent>
    </DropdownRoot>
  );
};
