import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

export type ChatState = {
  threadId: string;
  inputValue: string;
  model: string;
};

export type ChatActions = {
  setInputValue: (value: string) => void;
  setModel: (model: string) => void;
};

export type ChatStore = ChatState & ChatActions;

export const createChatStore = (initState: { threadId: string }) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initState.threadId,
    inputValue: '',
    model: 'microsoft/mai-ds-r1:free',

    setInputValue: (value: string) =>
      set((state) =>
        produce(state, (draft) => {
          draft.inputValue = value;
        })
      ),

    setModel: (model: string) =>
      set((state) =>
        produce(state, (draft) => {
          draft.model = model;
        })
      ),
  }));
};
