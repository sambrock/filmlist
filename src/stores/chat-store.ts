import { enableMapSet, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

enableMapSet();

export type ChatState = {
  threadId: string;
  model: string;
  value: string;
};

export type ChatStateActions = {
  setModel: (model: string) => void;
  setValue: (value: string) => void;
};

export type ChatStore = ChatState & { actions: ChatStateActions };

export type InitialChatState = {
  threadId: string;
};

export const createChatStore = (initialData: InitialChatState) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initialData.threadId,
    model: 'gpt-4.1-nano',
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
    },
  }));
};
