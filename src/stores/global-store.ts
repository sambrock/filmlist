import { enableMapSet, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

enableMapSet();

export type GlobalState = {
  model: string;
  chatStoreCache: Map<string, unknown>;
};

export type GlobalStateActions = {
  setModel: (model: string) => void;
  setChatStoreCache: (threadId: string, cache: unknown) => void;
};

export type GlobalStore = GlobalState & { actions: GlobalStateActions };

export const createGlobalStore = () => {
  return createStore<GlobalStore>()((set) => ({
    model: 'gpt-4.1-nano',
    chatStoreCache: new Map(),

    actions: {
      setModel: (model) => {
        set(
          produce((state: GlobalStore) => {
            state.model = model;
          })
        );
      },
      setChatStoreCache: (threadId, cache) => {
        set(
          produce((state: GlobalStore) => {
            state.chatStoreCache.set(threadId, cache);
          })
        );
      },
    },
  }));
};
