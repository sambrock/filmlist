import { ThreadProvider } from '@/providers/thread-provider';
import { Chat } from '../chat';

type Props = {
  threadId: string;
};

export const ThreadView = async ({ threadId }: Props) => {
  return (
    <ThreadProvider threadId={threadId}>
      <main className="bg-background-1 border-foreground-0/10 h-full w-full overflow-y-scroll px-8 py-4">
        <Chat />
      </main>
    </ThreadProvider>
  );
};
