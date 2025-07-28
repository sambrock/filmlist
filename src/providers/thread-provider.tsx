'use client';

import { createContext, useContext } from 'react';

type ThreadContext = {
  threadId: string;
};

export const ThreadContext = createContext<ThreadContext | undefined>(undefined);

export const ThreadProvider = (props: React.PropsWithChildren<ThreadContext>) => {
  const { threadId } = props;

  return <ThreadContext.Provider value={{ threadId }}>{props.children}</ThreadContext.Provider>;
};

export const useThreadContext = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThread must be used within a ThreadProvider');
  }
  return context;
};
