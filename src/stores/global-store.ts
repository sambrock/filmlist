import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import type { MessageAssistant, MessageUser } from '@/lib/drizzle/types';
import { Model } from '@/lib/models';

export type GlobalState = {
  model: Model;
  pendingMessages: (MessageUser | MessageAssistant)[];
};

export type GlobalStateActions = {
  setModel: (model: Model) => void;
};

export type GlobalStore = GlobalState & { actions: GlobalStateActions };

export const createGlobalStore = () => {
  return createStore<GlobalStore>()((set) => ({
    model: 'openai/gpt-4.1-nano',
    pendingMessages: [],

    actions: {
      setModel: (model) => {
        set(
          produce((state: GlobalState) => {
            state.model = model;
          })
        );
      },
    },
  }));
};
