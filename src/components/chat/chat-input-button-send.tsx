'use client';

import { cn } from '@/lib/utils/app.utils';
import { useChatStore } from '@/providers/chat-store-provider';
import { Button } from '../common/button';
import { IconArrowUp } from '../common/icon';

type Props = React.ComponentProps<'button'>;

export const ChatInputButtonSend = ({ className, ...props }: Props) => {
  const disabled = useChatStore((store) => store.inputValue.trim().length === 0);

  return (
    <Button className={cn(className, '')} variant="primary" size="icon" disabled={disabled} {...props}>
      <IconArrowUp className="size-5" />
    </Button>
  );
};
