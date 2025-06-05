import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

export type ChatState = {
  threadId: string | null;
  messageValue: string;
  model: string;
};

export type ChatActions = {
  setMessageValue: (value: string) => void;
  setModel: (model: string) => void;
};

export type ChatStore = ChatState & ChatActions;

export const createChatStore = (initState: { threadId: string | null }) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initState.threadId,
    messageValue: '',
    model: 'microsoft/mai-ds-r1:free',

    setMessageValue: (value: string) =>
      set((state) =>
        produce(state, (draft) => {
          draft.messageValue = value;
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
