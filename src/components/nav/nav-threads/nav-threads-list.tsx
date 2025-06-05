'use client';

import { groupThreadsByTime } from '@/lib/utils/group-threads';
import { useUser } from '@/providers/user-provider';
import { useUserThreads } from '@/hooks/api/useUserThreads';

import { NavThreadsListItem } from './nav-threads-list-item';

export const NavThreadsList = () => {
  const { userId } = useUser();
  const userThreadsQuery = useUserThreads(userId);

  const grouped = groupThreadsByTime(userThreadsQuery.data);

  return (
    <div className="flex flex-col gap-4">
      {[...grouped.keys()].map((label, index) => (
        <div key={index} className="flex flex-col">
          <div className="text-text-secondary mb-1.5 text-sm font-medium">{label}</div>
          {grouped
            .get(label)
            ?.map((thread) =>
              thread.title ? (
                <NavThreadsListItem key={thread.threadId} threadId={thread.threadId} title={thread.title} />
              ) : null
            )}
        </div>
      ))}
    </div>
  );
};
