'use client';

import Link from 'next/link';

import { Button } from '@/components/common/button';

type Props = {
  threadId: string;
  title?: string;
};

export const NavThreadsListItem = ({ threadId, title }: Props) => {
  return (
    <Button variant="transparent" asChild>
      <Link href={`/chat/${threadId}`} className="cursor-pointer p-2 hover:bg-gray-100">
        <div>{title}</div>
      </Link>
    </Button>
  );
};
