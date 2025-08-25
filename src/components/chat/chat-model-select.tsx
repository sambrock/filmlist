'use client';

import { ChevronDown } from 'lucide-react';

import { models } from '@/lib/models';
import { cn } from '@/lib/utils/cn';
import { useChatStore } from '@/providers/chat-store-provider';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';

export const ChatModelSelect = () => {
  const [activeModel, setModel] = useChatStore((store) => [store.model, store.actions.setModel]);

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button className="text-sm" size="sm" variant="ghost">
          {models.get(activeModel)!.name}
          <ChevronDown className="size-5" />
        </Button>
      </DropdownTrigger>
      <DropdownContent className="min-w-80" align="start" sideOffset={2}>
        {[...models.values()]
          .filter((model) => model.active)
          .map((model) => (
            <DropdownItem
              key={model.id}
              className={cn(model.id === activeModel && 'bg-background-1/50')}
              onClick={() => setModel(model.id)}
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
