'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = (props: React.PropsWithChildren) => {
  return <ConvexProvider client={convex}>{props.children}</ConvexProvider>;
};
