import { enableMapSet, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import { Message, Movie } from '@/lib/drizzle/zod';
import { Model } from '@/lib/openai/models';

enableMapSet();

export type ChatMessage = Message & { movies: Movie[] };

export type ChatState = {
  threadId: string;
  threadExists: boolean;
  inputValue: string;
  model: Model;

  messageStack: Map<string, Partial<ChatMessage>>;
};

export type ChatActions = {
  setThreadExists: (exists: boolean) => void;
  setInputValue: (value: string) => void;
  setModel: (model: Model) => void;
  setMessage: (messageId: string, message: ChatMessage) => void;
  appendMessageContent: (messageId: string, content: string) => void;
  addMessageMovies: (messageId: string, movie: Movie) => void;
};

export type ChatStore = ChatState & { actions: ChatActions };

export const createChatStore = (initState: { threadId: string; threadExists?: boolean }) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initState.threadId,
    threadExists: initState.threadExists ?? false,
    inputValue: '',
    model: 'meta-llama/llama-3.3-8b-instruct:free',

    messageStack: new Map<string, ChatMessage>(),

    actions: {
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

      appendMessageContent: (messageId, content) =>
        set((state) =>
          produce(state, (draft) => {
            const message = draft.messageStack.get(messageId);
            if (message) {
              message.content += content;
              draft.messageStack.set(messageId, message);
            }
          })
        ),

      addMessageMovies: (messageId, movie) =>
        set((state) =>
          produce(state, (draft) => {
            const message = draft.messageStack.get(messageId);
            if (message) {
              message.movies?.push(movie);
              draft.messageStack.set(messageId, message);
            }
          })
        ),
    },
  }));
};
