import { produce } from 'immer';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Model } from '@/lib/models';

export type ClientState = {
  chats: ClientStateChat[];
};

export type ClientStateChat = {
  chatId: string;
  value: string;
  model: Model;
  isNewPage: boolean;
  isPending: boolean;
};

export type ClientStateActions = {
  initChat: (chatId: string) => void;
  getChat: (chatId: string) => ClientStateChat;
  updateChat: (chatId: string, updates: Partial<ClientStateChat>) => void;
};

export type ClientStore = ClientState & { actions: ClientStateActions };

export const createClientStore = () => {
  return createStore<ClientStore>()(
    persist(
      (set, get) => ({
        chats: [],
        actions: {
          initChat: (chatId) => {
            set(
              produce((state: ClientState) => {
                state.chats.push({
                  ...DEFAULT_CLIENT_CHAT_STATE,
                  chatId,
                });
              })
            );
          },
          getChat: (chatId) => {
            const chat = get().chats.find((c) => c.chatId === chatId);
            if (!chat) return { ...DEFAULT_CLIENT_CHAT_STATE, chatId };
            return chat;
          },
          updateChat: (chatId, updates) => {
            set(
              produce((state: ClientState) => {
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
        name: 'client-store',
        partialize: (state) => ({ chats: state.chats }),
      }
    )
  );
};

export const DEFAULT_CLIENT_CHAT_STATE: ClientStateChat = {
  chatId: '',
  value: '',
  model: 'openai/gpt-4.1-nano',
  isNewPage: true,
  isPending: false,
};
