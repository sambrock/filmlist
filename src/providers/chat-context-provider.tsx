'use client';

import { createContext, useContext, useRef } from 'react';

import { useClientStore } from './client-store-provider';

export const ChatContext = createContext<{ chatId: string } | undefined>(undefined);

export const ChatContextProvider = ({
  chatId,
  isPersisted,
  ...props
}: React.PropsWithChildren<{ chatId: string; isPersisted: boolean }>) => {
  const dispatch = useClientStore((store) => store.dispatch);

  const initRef = useRef(false);
  if (!initRef.current) {
    dispatch({ type: 'INIT_CHAT', payload: { chatId, isPersisted } });
    initRef.current = true;
  }

  // if (!initRef.current) return null;
  return <ChatContext.Provider value={{ chatId }}>{props.children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(`useChatContext must be used within ChatContextProvider`);
  }

  return context;
};
