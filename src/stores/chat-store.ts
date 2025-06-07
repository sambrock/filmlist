import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

export type ChatState = {
  threadId: string;
  threadExists: boolean;
  inputValue: string;
  model: string;
};

export type ChatActions = {
  setThreadExists: (exists: boolean) => void;
  setInputValue: (value: string) => void;
  setModel: (model: string) => void;
};

export type ChatStore = ChatState & ChatActions;

export const createChatStore = (initState: { threadId: string; threadExists?: boolean }) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initState.threadId,
    threadExists: initState.threadExists ?? false,
    inputValue: '',
    model: 'microsoft/mai-ds-r1:free',

    setThreadExists: (exists: boolean) =>
      set((state) =>
        produce(state, (draft) => {
          draft.threadExists = exists;
        })
      ),

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
