import { enableMapSet, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import { ChatMessage } from '@/lib/types';

enableMapSet();

export type ChatState = {
  threadId: string;
  threadExists: boolean;
  inputValue: string;
  model: string;

  messageStack: Map<string, ChatMessage>;
};

export type ChatActions = {
  setThreadExists: (exists: boolean) => void;
  setInputValue: (value: string) => void;
  setModel: (model: string) => void;
  setMessage: (messageId: string, message: ChatMessage) => void;
};

export type ChatStore = ChatState & ChatActions;

export const createChatStore = (initState: { threadId: string; threadExists?: boolean }) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initState.threadId,
    threadExists: initState.threadExists ?? false,
    inputValue: '',
    model: 'meta-llama/llama-3.3-8b-instruct:free',

    messageStack: new Map<string, ChatMessage>(),

    setThreadExists: (exists) =>
      set((state) =>
        produce(state, (draft) => {
          draft.threadExists = exists;
        })
      ),

    setInputValue: (value) =>
      set((state) =>
        produce(state, (draft) => {
          draft.inputValue = value;
        })
      ),

    setModel: (model) =>
      set((state) =>
        produce(state, (draft) => {
          draft.model = model;
        })
      ),

    setMessage: (messageId, message) =>
      set((state) =>
        produce(state, (draft) => {
          draft.messageStack.set(messageId, message);
        })
      ),
  }));
};
