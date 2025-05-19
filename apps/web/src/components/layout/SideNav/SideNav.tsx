import Image from 'next/image';

import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'>;

export const SideNav = ({ className, ...props }: Props) => {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <div className="px-4 py-4">
        <Image src="logo.svg" alt="logo" width={30} height={0} />
      </div>
    </div>
  );
};
