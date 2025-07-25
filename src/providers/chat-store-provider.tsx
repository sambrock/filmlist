'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { createChatStore, type ChatStore } from '@/stores/chat-store';

export type ChatStoreApi = ReturnType<typeof createChatStore>;

export const ChatStoreContext = createContext<ChatStoreApi | undefined>(undefined);

type Props = {
  threadId: string;
  threadExists?: boolean;
};

export const ChatStoreProvider = ({ threadId, threadExists, ...props }: React.PropsWithChildren<Props>) => {
  const storeRef = useRef<ChatStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createChatStore({
      threadId,
      threadExists,
    });
  }

  return <ChatStoreContext.Provider value={storeRef.current}>{props.children}</ChatStoreContext.Provider>;
};

export const useChatStore = <T,>(selector: (store: ChatStore) => T): T => {
  const context = useContext(ChatStoreContext);
  if (!context) {
    throw new Error(`useChatStore must be used within ChatStoreProvider`);
  }

  return useStore(context, useShallow(selector));
};

export const useChatActions = () => {
  return useChatStore((store) => store.actions);
};

export const useChatMessages = () => {
  return useChatStore((store) => store.messages);
};

export const useChatThreadId = () => {
  return useChatStore((store) => store.threadId);
};

export const useChatInputValue = () => {
  return useChatStore((store) => store.inputValue);
};

export const useChatModel = () => {
  return useChatStore((store) => store.model);
};
