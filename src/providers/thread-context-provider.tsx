'use client';

import { createContext, useContext } from 'react';

const ThreadContext = createContext<{ threadId: string } | undefined>(undefined);

type Props = {
  threadId: string;
};

export const ThreadContextProvider = (props: React.PropsWithChildren<Props>) => {
  return (
    <ThreadContext.Provider
      value={{
        threadId: props.threadId,
      }}
    >
      {props.children}
    </ThreadContext.Provider>
  );
};

export const useThreadContext = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThreadContext must be used within a ThreadProvider');
  }
  return context;
};
