'use client';

import { cn } from '@/lib/utils/cn';
import { Button } from '../common/button';
import { IconArrowUp } from '../common/icon';

type Props = React.ComponentProps<'button'>;

export const ChatInputButtonSend = ({ className, ...props }: Props) => {
  return (
    <Button className={cn(className, '')} size="icon" {...props}>
      <IconArrowUp className="size-5" />
    </Button>
  );
};
