import { trpc } from '@/lib/trpc';
import { generateUuid } from '@/lib/utils/uuid';

export default async function Home() {
  const threadId = generateUuid();

  await trpc.threads.initThread.mutate({
    threadId: threadId,
    userId: '37d387ec-32fd-45f7-af31-0df25936b241',
  });

  return threadId;
}
