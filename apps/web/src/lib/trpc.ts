import { CreateTRPCProxyClient, createTRPCProxyClient, httpBatchLink } from '@trpc/client';

// import { type AppRouter } from '../../../api/src/routers/app.router';
import { type AppRouter } from '@filmlist/api/app';

// @ts-ignore
export const trpc: CreateTRPCProxyClient<AppRouter> = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8787/trpc',
    }),
  ],
});
