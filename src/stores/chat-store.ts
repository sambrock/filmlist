import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import type { ChatSSEData } from '@/app/api/chat/route';
import { parseRecommendationsFromResponse } from '@/lib/ai';
import type { Message, MessageWithRecommendations } from '@/lib/drizzle';
import { DeepPartial } from '@/lib/utils';

export type ChatMessage =
  | {
      state: 'pending';
      user: Partial<Message>;
      assistant: DeepPartial<MessageWithRecommendations>;
    }
  | {
      state: 'complete';
      user: Message;
      assistant: MessageWithRecommendations;
    };

export type ChatState = {
  threadId: string;
  threadExists: boolean;
  inputValue: string;
  model: string;
  messages: ChatMessage[];
};

export type ChatActions = {
  update: (partial: Partial<ChatState>) => void;
  createMessage: () => void;
  processChatSSE: (data: ChatSSEData) => void;
};

export type ChatStore = ChatState & { actions: ChatActions };

export const createChatStore = (initState: { threadId: string; threadExists?: boolean }) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initState.threadId,
    threadExists: initState.threadExists ?? false,
    inputValue: '',
    model: '',
    messages: [],

    actions: {
      update: (partial) => {
        set(
          produce((state: ChatStore) => {
            Object.assign(state, partial);
          })
        );
      },

      createMessage: () => {
        set(
          produce((state: ChatStore) => {
            state.messages.push({
              state: 'pending',
              user: { content: state.inputValue },
              assistant: { content: '', recommendations: [] },
            });
          })
        );
      },

      processChatSSE: (data) => {
        set(
          produce((state: ChatStore) => {
            const index = state.messages.length - 1;
            const message = state.messages[index];

            if (data.type === 'content') {
              const content = (message.assistant.content += data.v);
              message.assistant.content = content;
              message.assistant.recommendations = parseRecommendationsFromResponse(content);
            }
            if (data.type === 'message') {
              if (data.v.role === 'user') message.user = data.v;
              if (data.v.role === 'assistant') Object.assign(message.assistant, data.v); // Don't overwrite recommendations
            }
            if (data.type === 'recommendations') {
              console.log(data.v);
              message.assistant.recommendations = data.v;
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
