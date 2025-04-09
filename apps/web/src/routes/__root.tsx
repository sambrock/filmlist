import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { QueryClientProvider } from '../providers/QueryClientProvider';

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider>
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/lists/$filmId" params={{ filmId: '2' }} className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  ),
});
