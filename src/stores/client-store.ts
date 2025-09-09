import { enableMapSet } from 'immer';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Model } from '@/lib/models';
import { ClientStateAction, reducer } from './client-store-reducer';

enableMapSet();

export type MovieModalState = {
  isActive: boolean;
  movieId: number | null;
};

export type ClientChatState = {
  chatId: string;
  model: Model;
  inputValue: string;
  isPersisted: boolean;
  isPending: boolean;
  unseenChanges: boolean;
};

export type ClientState = {
  currentChatId: string;
  model: Model;
  chats: ClientChatState[];
  movieModal: MovieModalState;
};

export type ClientStore = ClientState & {
  chat: (chatId: string) => ClientState['chats'][number];
  dispatch: (action: ClientStateAction) => void;
};

export const createClientStore = () => {
  return createStore<ClientStore>()(
    persist(
      (set, get) => ({
        currentChatId: '',
        model: 'openai/gpt-4.1-nano',
        chats: [],

        movieModal: {
          isActive: false,
          movieId: 0,
        },

        chat: (chatId) =>
          get().chats.find((chat) => chat.chatId === chatId) || {
            chatId: '',
            inputValue: '',
            isPending: false,
            isPersisted: false,
            model: get().model,
            unseenChanges: false,
          },
        dispatch: (action) => set((state) => reducer(state, action)),
      }),
      {
        name: 'filmlist/store',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        partialize: ({ dispatch, movieModal, ...state }) => state,
      }
    )
  );
};
