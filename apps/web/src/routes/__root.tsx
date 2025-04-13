import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { RootLayout } from '../components/layout/RootLayout';
import { QueryClientProvider } from '../providers/QueryClientProvider';

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider>
      <RootLayout>
        <div className="flex gap-4 pb-8">
          <Link to="/list/$id" params={{ id: 'us1bh1xp85q87zmybdbobb' }} className="text-blue-500">
            List 1
          </Link>
          <Link to="/list/$id" params={{ id: '1ntfztdztppyfifuo1w5b6' }} className="text-blue-500">
            List 2
          </Link>
        </div>
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </RootLayout>
    </QueryClientProvider>
  ),
});
