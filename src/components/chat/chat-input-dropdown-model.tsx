
import { useChatActions, useChatModel } from '@/providers/chat-store-provider';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';
import { IconChevronDown } from '../common/icon';

export const ChatInputDropdownModel = () => {
  // const model = useChatModel();
  // const { updateChat } = useChatActions();

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button variant="transparent" size="sm" className="text-sm">
          {/* {models.get(model)!.label} */}
          <IconChevronDown className="-mr-1 size-4" />
        </Button>
      </DropdownTrigger>

      <DropdownContent align="start" side="top" sideOffset={4} className="origin-bottom-left">
        {/* {[...models.values()].map((model) => (
          <DropdownItem
            key={model.model}
            className="cursor-pointer"
            onSelect={() => {
              updateChat({ model: model.model });
            }}
          >
            {model.label}
          </DropdownItem>
        ))} */}
      </DropdownContent>
    </DropdownRoot>
  );
};
