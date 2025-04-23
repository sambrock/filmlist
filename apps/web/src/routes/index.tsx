import { createFileRoute } from '@tanstack/react-router';

import { trpc } from '../lib/api/trpc';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <div className="p-8"></div>;
}
