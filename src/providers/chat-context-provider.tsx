'use client';

import { createContext, useContext, useEffect } from 'react';

import { useClientStore } from './client-store-provider';

export const ChatContext = createContext<{ chatId: string } | undefined>(undefined);

export const ChatContextProvider = ({
  chatId,
  isPersisted,
  ...props
}: React.PropsWithChildren<{ chatId: string; isPersisted: boolean }>) => {
  const dispatch = useClientStore((store) => store.dispatch);

  useEffect(() => {
    dispatch({ type: 'INIT_CHAT', payload: { chatId, isPersisted } });
  }, []);

  return <ChatContext.Provider value={{ chatId }}>{props.children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(`useChatContext must be used within ChatContextProvider`);
  }

  return context;
};
