'use client';

import Link from 'next/link';
import { useIsClient } from 'usehooks-ts';

import { useUserThreadsQuery } from '@/lib/api/useUserThreadsQuery';

export const SidebarThreadLinks = () => {
  const threadsQuery = useUserThreadsQuery();
  const isClient = useIsClient();

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }
  return (
    <ul>
      {threadsQuery.data?.map((thread, index) => (
        <li key={thread.threadId}>
          <Link href={`/${thread.threadId}`}>Thread {index}</Link>
        </li>
      ))}
    </ul>
  );
};
