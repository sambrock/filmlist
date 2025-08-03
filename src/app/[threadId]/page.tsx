import { ThreadContextProvider } from '@/providers/thread-context-provider';
import { ThreadView } from '@/components/views/thread-view';

type Props = {
  params: Promise<{
    threadId: string;
  }>;
};

export default async function ThreadPage(props: Props) {
  const { threadId } = await props.params;

  return (
    <ThreadContextProvider threadId={threadId}>
      <ThreadView />
    </ThreadContextProvider>
  );
}
