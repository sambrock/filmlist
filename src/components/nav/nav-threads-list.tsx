'use client';

import { useUserThreadsQuery } from '@/hooks/api/useUserThreads.query';
import { NavThreadsListItem } from './nav-threads-list-item';

export const NavThreadsList = () => {
  const userThreadsQuery = useUserThreadsQuery('37d387ec-32fd-45f7-af31-0df25936b241');

  return (
    <div className="flex flex-col gap-4">
      <div>Chats</div>
      {userThreadsQuery.data?.map((thread) => (
        <NavThreadsListItem key={thread.threadId} threadId={thread.threadId} title={thread.title} />
      ))}
    </div>
  );
};
