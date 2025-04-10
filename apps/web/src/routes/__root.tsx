import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { RootLayout } from '../components/layout/RootLayout';
import { QueryClientProvider } from '../providers/QueryClientProvider';

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider>
      <RootLayout>
        <Outlet />
        <TanStackRouterDevtools />
      </RootLayout>
    </QueryClientProvider>
  ),
});
