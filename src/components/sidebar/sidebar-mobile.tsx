'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, SquarePen } from 'lucide-react';
import { useOnClickOutside } from 'usehooks-ts';

import { cn } from '@/lib/utils';
import { Button } from '../common/button';

type Props = {
  sidebarComponent: React.ReactNode;
} & React.ComponentProps<'header'>;

export const SidebarMobile = ({ sidebarComponent, className, ...props }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(sidebarRef as React.RefObject<HTMLDivElement>, () => setSidebarOpen(false));

  return (
    <header
      className={cn(
        'bg-background-1 border-foreground-0/5 fixed top-0 left-0 z-50 flex w-screen gap-2 border-b px-3 pt-3 pb-2',
        className
      )}
      {...props}
    >
      <Link href="/">
        <Image className="relative z-[999] w-6" src="/logo.svg" alt="Logo" width={28} height={38} />
      </Link>

      <Button className="text-foreground-0/80 ml-auto" asChild>
        <Link href="/">
          <SquarePen className="size-6" />
        </Link>
      </Button>

      <Button className="text-foreground-0/80 -mr-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu className="size-6" />
      </Button>

      <div ref={sidebarRef} className={cn('fixed inset-0 w-[260px]', sidebarOpen ? 'block' : 'hidden')}>
        {sidebarComponent}
        {/* <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        /> */}
        {/* <div>{sidebarComponent}</div> */}
      </div>
    </header>
  );
};
