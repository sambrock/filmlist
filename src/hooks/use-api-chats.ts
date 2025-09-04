import { trpc } from '@/lib/trpc/client';
import { useUserContext } from '@/providers/user-context-provider';

export const useApiChats = () => {
  const { userId } = useUserContext();

  const { data } = trpc.getChats.useQuery({ userId }, { enabled: !!userId });

  const chats = data || [];

  return chats;
};
