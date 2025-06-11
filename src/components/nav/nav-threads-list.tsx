'use client';

import { groupThreadsByTime } from '@/lib/utils/group-threads';
import { useUserInfoQuery } from '@/hooks/api/useUserInfoQuery';
import { NavThreadsListItem } from './nav-threads-list-item';

export const NavThreadsList = () => {
  const userInfoQuery = useUserInfoQuery('37d387ec-32fd-45f7-af31-0df25936b241');

  const grouped = groupThreadsByTime(userInfoQuery.data?.threads || []);

  return (
    <div className="flex flex-col gap-4">
      {[...grouped.keys()].map((label, index) => (
        <div key={index} className="flex flex-col">
          <div className="text-text-secondary mb-1.5 text-sm font-medium">{label}</div>
          {grouped
            .get(label)
            ?.map((thread) => (
              <NavThreadsListItem key={thread.threadId} threadId={thread.threadId} title={thread.title} />
            ))}
        </div>
      ))}
    </div>
  );
};
