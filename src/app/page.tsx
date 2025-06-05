import { trpc } from '@/lib/trpc/api';

export default async function Home() {
  const threadId = await trpc.createThread.mutate({
    title: 'Thread',
    userId: 'j575fwxmyt948vvpf9ppwd6dkx7h7se8',
  });

  return threadId;
}
