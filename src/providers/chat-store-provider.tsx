'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { ChatStore, createChatStore } from '@/stores/chat-store';

export type ChatStoreApi = ReturnType<typeof createChatStore>;

export const ChatStoreContext = createContext<ChatStoreApi | undefined>(undefined);

export const ChatStoreProvider = (props: React.PropsWithChildren) => {
  const storeRef = useRef<ChatStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createChatStore();
    storeRef.current.subscribe((state) => console.log('chat-store', state));
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
