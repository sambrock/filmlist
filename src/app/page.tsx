import { ThreadView } from '@/components/views/thread-view';

export default function Thread() {
  // const threadId = generateUuid();
  const threadId = 'b0a63a00-6876-42eb-8c48-2205efa5d927';

  return <ThreadView threadId={threadId} />;
}
