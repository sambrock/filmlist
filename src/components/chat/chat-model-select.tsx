'use client';

import { ChevronDown } from 'lucide-react';

import { models } from '@/lib/models';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useThreadContext } from '@/providers/thread-context-provider';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';

export const ChatModelSelect = () => {
  const { threadId } = useThreadContext();

  const selectedModel = useGlobalStore((s) => s.chatModel.get(threadId) || s.model);
  const dispatch = useGlobalStore((s) => s.dispatch);

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button className="text-sm" size="sm" variant="ghost">
          {models.get(selectedModel)!.name}
          <ChevronDown className="size-5" />
        </Button>
      </DropdownTrigger>
      <DropdownContent className="min-w-80 origin-bottom-left" align="start" sideOffset={2}>
        {[...models.values()]
          .filter((model) => model.active)
          .map((model) => (
            <DropdownItem
              key={model.id}
              className={cn(model.id === selectedModel && 'bg-background-1/50')}
              onClick={() => dispatch({ type: 'SET_MODEL', payload: { threadId, model: model.id } })}
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
