import ChatPage from '../../page';

type Props = {
  params: Promise<{ thread_id: string }>;
};

export default async function ExistingChatPage(props: Props) {
  const params = await props.params;

  return <ChatPage threadId={params.thread_id} />;
}
