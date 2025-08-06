import { enableMapSet, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

enableMapSet();

type ThreadState = {
  threadId: string;
  model: string;
  inputValue: string;
};

export type ClientState = {
  userId: string;
  threadId: string;
  model: string;
  threads: Map<string, ThreadState>;
};

export type ClientStateActions = {
  setUserId: (userId: string) => void;
  setThreadId: (threadId: string) => void;
  setModel: (model: string) => void;
  setThread: (threadId: string, threadState: ThreadState) => void;
};

export type InitClientState = {
  userId?: string;
};

export type ClientStore = ClientState & { actions: ClientStateActions };

export const createClientStore = (init?: InitClientState) => {
  return createStore<ClientStore>()((set) => ({
    userId: init?.userId || '',
    threadId: '',
    model: 'gpt-4.1-nano',
    threads: new Map(),
    actions: {
      setUserId: (userId) => {
        set(
          produce((state: ClientStore) => {
            state.userId = userId;
          })
        );
      },
      setThreadId: (threadId) => {
        set(
          produce((state: ClientStore) => {
            state.threadId = threadId;
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
