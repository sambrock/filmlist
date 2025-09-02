import { produce } from 'immer';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Model } from '@/lib/models';

export type Chat = {
  chatId: string;
  value: string;
  model: Model;
  isPersisted: boolean;
  isPending: boolean;
};

export type ChatStore = {
  chats: Chat[];
  actions: {
    initChat: (chatId: string, isPersisted: boolean) => void;
    getChat: (chatId: string) => Chat;
    updateChat: (chatId: string, updates: Partial<Chat>) => void;
  };
};

export const createChatStore = () => {
  return createStore<ChatStore>()(
    persist(
      (set, get) => ({
        chats: [],
        actions: {
          initChat: (chatId, isPersisted) => {
            set(
              produce((state: ChatStore) => {
                state.chats.push({
                  chatId,
                  value: '',
                  model: 'openai/gpt-4.1-nano',
                  isPersisted,
                  isPending: false,
                  // pendingMessages: [],
                });
              })
            );
          },
          getChat: (chatId) => get().chats.find((c) => c.chatId === chatId)!,
          updateChat: (chatId, updates) => {
            set(
              produce((state: ChatStore) => {
                const chat = state.chats.find((c) => c.chatId === chatId);
                if (chat) {
                  Object.assign(chat, updates);
                }
              })
            );
          },
        },
      }),
      {
        name: 'chats',
        partialize: (state) => ({ chats: state.chats }),
      }
    )
  );
};
