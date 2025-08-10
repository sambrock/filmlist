import { enableMapSet, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

enableMapSet();

export type GlobalState = {
  userId: string;
  model: string;
  chatStoreCache: Map<string, unknown>;
};

export type GlobalStateActions = {
  setUserId: (userId: string) => void;
  setModel: (model: string) => void;
  setChatStoreCache: (threadId: string, cache: unknown) => void;
};

export type GlobalStoreInitialState = {
  userId?: string;
};

export type GlobalStore = GlobalState & { actions: GlobalStateActions };

export const createGlobalStore = (initialState: GlobalStoreInitialState) => {
  return createStore<GlobalStore>()((set) => ({
    userId: initialState.userId || '',
    model: 'gpt-4.1-nano',
    chatStoreCache: new Map(),

    actions: {
      setUserId: (userId) => {
        set(
          produce((state: GlobalState) => {
            state.userId = userId;
          })
        );
      },
      setModel: (model) => {
        set(
          produce((state: GlobalState) => {
            state.model = model;
          })
        );
      },
      setChatStoreCache: (threadId, cache) => {
        set(
          produce((state: GlobalState) => {
            state.chatStoreCache.set(threadId, cache);
          })
        );
      },
    },
  }));
};
