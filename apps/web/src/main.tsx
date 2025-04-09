import { StrictMode } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';

import { routeTree } from './route-tree';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
