'use client';

import { createContext, useContext, useRef } from 'react';

import { useChatStore } from './chat-store-provider';

export const ChatContext = createContext<{ chatId: string } | undefined>(undefined);

export const ChatContextProvider = ({
  chatId,
  isPersisted,
  ...props
}: React.PropsWithChildren<{ chatId: string; isPersisted: boolean }>) => {
  const initChat = useChatStore((store) => store.actions.initChat);
  const initRef = useRef(false);

  if (!initRef.current) {
    initChat(chatId, isPersisted);
    initRef.current = true;
  }

  return <ChatContext.Provider value={{ chatId }}>{props.children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(`useChatContext must be used within ChatContextProvider`);
  }

  return context;
};
