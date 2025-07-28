import { ThreadProvider } from '@/providers/thread-provider';
import { Chat } from '../chat';

type Props = {
  threadId: string;
};

export const ThreadView = async ({ threadId }: Props) => {
  return (
    <ThreadProvider threadId={threadId}>
      <Chat />
    </ThreadProvider>
  );
};
