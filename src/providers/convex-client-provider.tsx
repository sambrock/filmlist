'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient('https://posh-sandpiper-414.convex.cloud');

export const ConvexClientProvider = (props: React.PropsWithChildren) => {
  return <ConvexProvider client={convex}>{props.children}</ConvexProvider>;
};
