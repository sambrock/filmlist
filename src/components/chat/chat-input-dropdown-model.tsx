import { models } from '@/lib/openai/models';
import { useChatStore } from '@/providers/chat-store-provider';
import { Button } from '../common/button';
import {
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownRoot,
  DropdownTrigger,
} from '../common/dropdown';
import { IconChevronDown } from '../common/icon';

export const ChatInputDropdownModel = () => {
  const [model, setModel] = useChatStore((store) => [store.model, store.actions.setModel]);

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button variant="transparent" size="sm" className="text-sm">
          {models.get(model)!.label}
          <IconChevronDown className="-mr-1 size-4" />
        </Button>
      </DropdownTrigger>

      <DropdownPortal>
        <DropdownContent
          align="start"
          side="top"
          sideOffset={4}
          className="motion-scale-in-[.9] motion-duration-150 motion-preset-fade origin-bottom-left"
        >
          {[...models.values()].map((model) => (
            <DropdownItem
              key={model.model}
              className="cursor-pointer"
              onSelect={() => {
                setModel(model.model);
              }}
            >
              {model.label}
            </DropdownItem>
          ))}
        </DropdownContent>
      </DropdownPortal>
    </DropdownRoot>
  );
};
