import superjson from 'superjson';
import { persist, StorageValue } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Model } from '@/lib/models';
import { GlobalStoreAction, reducer } from './global-store-reducer';

export type GlobalState = {
  activeThreadId: string;
  model: Model;

  chatPending: Set<string>; // threadId
  chatUnseenUpdates: Set<string>; // threadId
  chatInputValue: Map<string, string>; // threadId, value
  chatModel: Map<string, Model>; // threadId, model
  messagePendingContent: Map<string, string>; // messageId, content
};

export type GlobalStore = GlobalState & {
  dispatch: (action: GlobalStoreAction) => void;
};

export const createGlobalStore = () => {
  return createStore<GlobalStore>()(
    persist(
      (set) => ({
        activeThreadId: '',
        model: 'openai/gpt-4.1-nano',

        chatPending: new Set(),
        chatUnseenUpdates: new Set(),
        chatInputValue: new Map(),
        chatModel: new Map(),
        messagePendingContent: new Map(),

        dispatch: (action) => set((state) => reducer(state, action)),
      }),
      {
        name: 'fc/store',
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            return superjson.parse(str) as StorageValue<GlobalState>;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, superjson.stringify(value));
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
        // Don't include dispatch in the persisted state
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        partialize: ({ dispatch, ...state }) => state,
      }
    )
  );
};
