'use client';

import { ChevronDown } from 'lucide-react';

import { useChatStore } from '@/providers/chat-store-provider';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';

export const ChatModelSelect = () => {
  const [model, setModel] = useChatStore((store) => [store.model, store.actions.setModel]);

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button variant="ghost" pill>
          {model}
          <ChevronDown className="ml-1 size-5" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="center" sideOffset={4}>
        <DropdownItem onClick={() => setModel('gpt-4.1-nano')}>gpt-4.1-nano</DropdownItem>
        <DropdownItem onClick={() => setModel('gpt-4.1')}>gpt-4.1</DropdownItem>
        <DropdownItem onClick={() => setModel('gpt-4')}>gpt-4</DropdownItem>
      </DropdownContent>
    </DropdownRoot>
  );
};
