import { HydrateClient, trpc } from '@/lib/trpc/server';
import { ThreadView } from '@/components/views/thread-view';

type Props = {
  params: Promise<{ threadId: string }>;
};

export default async function ThreadPage(props: Props) {
  const { threadId } = await props.params;

  void trpc.getThreadMessages.prefetchInfinite({ threadId });

  return (
    <HydrateClient>
      <ThreadView threadId={threadId} empty={false} />
    </HydrateClient>
  );
}
