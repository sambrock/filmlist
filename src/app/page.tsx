import { HydrateClient } from '@/lib/trpc/server';
import { uuid } from '@/lib/utils';
import { ThreadView } from '@/components/views/thread-view';

export default async function NewThreadPage() {
  return (
    <HydrateClient>
      <ThreadView threadId={`new:${uuid()}`} empty={true} />
    </HydrateClient>
  );
}
