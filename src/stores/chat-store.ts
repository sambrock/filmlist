import { enableMapSet, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import { Model } from '@/lib/models';

enableMapSet();

export type ChatState = {
  threadId: string;
  model: Model;
  value: string;
};

export type ChatStateActions = {
  setModel: (model: Model) => void;
  setValue: (value: string) => void;
  setThreadId: (threadId: string) => void;
};

export type ChatStore = ChatState & { actions: ChatStateActions };

export type InitialChatState = {
  threadId: string;
};

export const createChatStore = (initialData: InitialChatState) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initialData.threadId,
    model: 'openai/gpt-4.1-nano',
    value: '',

    actions: {
      setModel: (model) => {
        set(
          produce((state: ChatState) => {
            state.model = model;
          })
        );
      },
      setValue: (value) => {
        set(
          produce((state: ChatState) => {
            state.value = value;
          })
        );
      },
      setThreadId: (threadId) => {
        set(
          produce((state: ChatState) => {
            state.threadId = threadId;
          })
        );
      },
    },
  }));
};
