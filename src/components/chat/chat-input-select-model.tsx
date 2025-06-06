import { Button } from '../common/button';
import { IconChevronDown } from '../common/icon';

export const ChatInputSelectModel = () => {
  return (
    <Button variant="transparent" className="text-sm">
      Llama 4 Scout
      <IconChevronDown className="-mr-2 ml-2 size-5" />
    </Button>
  );
};
