import { enableMapSet, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import type { Message, Movie } from '@/lib/drizzle/zod';
import { type Model } from '@/lib/openai/models';
import { type ChatEventStreamData } from '@/lib/utils/chat.utils';

enableMapSet();

export type ChatMessage =
  | {
      key: string;
      state: 'pending';
      user: Partial<Message>;
      assistant: Partial<Message>;
      movies: Movie[];
    }
  | {
      key: string;
      state: 'complete';
      user: Message;
      assistant: Message;
      movies: Movie[];
    };

export type ChatState = {
  threadId: string;
  threadExists: boolean;
  inputValue: string;
  model: Model;
  messages: Map<string, ChatMessage>;
};

export type ChatActions = {
  updateChat: (partial: Partial<ChatState>) => void;
  initMessage: () => string;
  ingestChatStream: (key: string, data: ChatEventStreamData) => void;
};

export type ChatStore = ChatState & { actions: ChatActions };

export const createChatStore = (initState: { threadId: string; threadExists?: boolean }) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initState.threadId,
    threadExists: initState.threadExists ?? false,
    inputValue: '',
    model: 'deepseek/deepseek-chat-v3-0324:free',
    messages: new Map(),

    actions: {
      updateChat: (partial) => {
        set(
          produce((state: ChatStore) => {
            Object.assign(state, partial);
          })
        );
      },

      initMessage: () => {
        const key = Math.random().toString(36).substring(2, 15);

        set(
          produce((state: ChatStore) => {
            state.messages.set(key, {
              key,
              state: 'pending',
              user: { content: state.inputValue },
              assistant: { content: '' },
              movies: [],
            });
          })
        );

        return key;
      },

      ingestChatStream: (key, data) => {
        set(
          produce((state: ChatStore) => {
            const message = state.messages.get(key)!;

            if (data.type === 'content') {
              message.assistant.content += data.v;
            }
            if (data.type === 'movie') {
              const movie: Movie = data.v;
              if (!message.movies.some((m) => m.movieId === movie.movieId)) {
                message.movies.push(movie);
              }
            }
            if (data.type === 'message') {
              if (data.v.role === 'user') {
                message.user = data.v;
              }
              if (data.v.role === 'assistant') {
                message.assistant = data.v;
              }
            }
            if (data.type === 'end') {
              message.state = 'complete';
            }
          })
        );
      },
    },
  }));
};
