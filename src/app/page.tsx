import { uuid } from '@/lib/utils';
import { ThreadContextProvider } from '@/providers/thread-context-provider';
import { UserContextProvider } from '@/providers/user-context-provider';
import { ThreadView } from '@/components/views/thread-view';

export default async function NewThreadPage() {
  return (
    <ThreadContextProvider threadId={uuid()}>
      <ThreadView />
    </ThreadContextProvider>
  );
}
