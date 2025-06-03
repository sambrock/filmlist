import { trpc } from '@/lib/trpc';
import { HydrateClient } from '@/lib/trpc/server';
import { Message } from './Message';

export default async function Home() {
  const threadId = await trpc.createThread.mutate({
    title: 'trpc test',
  });

  return (
    <HydrateClient>
      <div>Thread ID: {threadId}</div>

      <Message threadId={threadId} />
    </HydrateClient>
  );
}
