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
          <Link to="/list/$id" params={{ id: '06em71nwsz6wpc8reijnfn' }} className="text-blue-500">
            List 1
          </Link>
          <Link to="/list/$id" params={{ id: '15a5s3ie8hvaoak6jcm0jj' }} className="text-blue-500">
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
