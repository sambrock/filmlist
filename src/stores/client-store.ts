import { enableMapSet, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import { User } from '@/lib/auth';

enableMapSet();

type ThreadState = {
  threadId: string;
  model: string;
  inputValue: string;
};

export type ClientState = {
  user: User | null;
  model: string;
  threads: Map<string, ThreadState>;
};

export type InitialClientState = {
  user?: User | null;
  threadId?: string;
};

export type ClientStateActions = {
  initialize: (initialState: InitialClientState) => void;
  setModel: (model: string) => void;
  setThread: (threadId: string, threadState: ThreadState) => void;
};

export type ClientStore = ClientState & { actions: ClientStateActions };

export const createClientStore = () => {
  return createStore<ClientStore>()((set) => ({
    user: null,
    model: 'gpt-4.1-nano',
    threads: new Map(),
    actions: {
      initialize: (initialState) => {
        set(
          produce((state: ClientStore) => {
            if (initialState.user) {
              state.user = initialState.user;
            }
            if (initialState.threadId) {
              state.threads.set(initialState.threadId, {
                threadId: initialState.threadId,
                model: state.model,
                inputValue: '',
              });
            }
          })
        );
      },
      setModel: (model) => {
        set(
          produce((state: ClientStore) => {
            state.model = model;
          })
        );
      },
      setThread: (threadId, threadState) => {
        set(
          produce((state: ClientStore) => {
            state.threads.set(threadId, threadState);
          })
        );
      },
    },
  }));
};
