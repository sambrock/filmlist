import { enableMapSet } from 'immer';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Model } from '@/lib/models';
import { ClientStateAction, reducer } from './client-store-reducer';

enableMapSet();

export type ClientChatState = {
  chatId: string;
  model: Model;
  inputValue: string;
  isPersisted: boolean;
  isPending: boolean;
};

export type ClientState = {
  model: Model;
  chats: ClientChatState[];
};

export type ClientStore = ClientState & {
  chat: (chatId: string) => ClientState['chats'][number];
  dispatch: (action: ClientStateAction) => void;
};

export const createClientStore = () => {
  return createStore<ClientStore>()(
    persist(
      (set, get) => ({
        model: 'openai/gpt-4.1-nano',
        chats: [],

        chat: (chatId) =>
          get().chats.find((chat) => chat.chatId === chatId) || {
            chatId: '',
            inputValue: '',
            isPending: false,
            isPersisted: false,
            model: get().model,
          },
        dispatch: (action) => set((state) => reducer(state, action)),
      }),
      {
        name: 'filmlist/store',
        // Don't include dispatch in the persisted state
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        partialize: ({ dispatch, ...state }) => state,
      }
    )
  );
};
