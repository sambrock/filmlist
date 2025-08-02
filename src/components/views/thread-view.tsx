import { Chat } from '../chat';

export const ThreadView = async () => {
  return (
    <main className="bg-background-1 border-foreground-0/10 h-full w-full overflow-y-scroll px-8 py-4">
      <Chat />
    </main>
  );
};
