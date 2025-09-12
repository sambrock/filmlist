'use client';

import { createContext, useContext, useEffect, useRef } from 'react';

import { useGlobalStore } from './global-store-provider';

export type ThreadContext = {
  threadId: string;
  getThreadIsPersisted: () => boolean;
  setThreadIsPersisted: () => void;
};

export const ThreadContext = createContext<ThreadContext | undefined>(undefined);

export const ThreadContextProvider = ({
  threadId,
  isPersisted,
  ...props
}: React.PropsWithChildren<{ threadId: string; isPersisted: boolean }>) => {
  const isPersistedRef = useRef(isPersisted);

  const dispatch = useGlobalStore((s) => s.dispatch);
  useEffect(() => {
    dispatch({ type: 'SET_ACTIVE_THREAD_ID', payload: { threadId } });
  }, []);

  return (
    <ThreadContext.Provider
      value={{
        threadId,
        getThreadIsPersisted: () => isPersistedRef.current,
        setThreadIsPersisted: () => (isPersistedRef.current = true),
      }}
    >
      {props.children}
    </ThreadContext.Provider>
  );
};

export const useThreadContext = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error(`useThreadContext must be used within ThreadContextProvider`);
  }

  return context;
};
