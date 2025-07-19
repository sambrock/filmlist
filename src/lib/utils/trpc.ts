import { createTRPCContext } from '@trpc/tanstack-react-query';

import { AppRouter } from '@/server';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
