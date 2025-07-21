import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import type { ChatSSEData } from '@/app/api/chat/route';
import { parseRecommendationsFromResponse } from '@/lib/ai';
import type { MessageAssistant, MessageUser } from '@/lib/drizzle';

export type ChatMessage =
  | {
      status: 'pending';
      messageUser: { content: string; role: 'user' };
      messageAssistant: {
        content: string;
        role: 'assistant';
        recommendations: { title: string; releaseYear: string; why: string }[];
      };
    }
  | {
      status: 'done';
      messageUser: MessageUser;
      messageAssistant: MessageAssistant;
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
  initializePendingMessage: () => void;
  processChatSSE: (data: ChatSSEData) => void;
};

export type ChatStore = ChatState & { actions: ChatActions };

export const createChatStore = (initState: { threadId: string; threadExists?: boolean }) => {
  return createStore<ChatStore>()((set) => ({
    threadId: initState.threadId,
    threadExists: initState.threadExists || false,
    inputValue: '',
    model: '',
    pending: false,
    messages: [],

    actions: {
      update: (partial) => {
        set(
          produce((state: ChatStore) => {
            Object.assign(state, partial);
          })
        );
      },

      initializePendingMessage: () => {
        set(
          produce((state: ChatStore) => {
            if (state.messages.find((m) => m.status === 'pending')) {
              return;
            }
            state.messages.push({
              status: 'pending',
              messageUser: { content: '', role: 'user' },
              messageAssistant: { content: '', role: 'assistant', recommendations: [] },
            });
          })
        );
      },

      processChatSSE: (data) => {
        set(
          produce((state: ChatStore) => {
            const index = state.messages.findIndex((m) => m.status === 'pending');
            const message = state.messages[index];

            if (message.status === 'pending' && data.type === 'content') {
              message.messageAssistant.content += data.v;
              message.messageAssistant.recommendations = parseRecommendationsFromResponse(
                message.messageAssistant.content
              );
            }
            if (data.type === 'message' && data.v.role === 'user') {
              message.messageUser = data.v as MessageUser;
            }
            if (data.type === 'message' && data.v.role === 'assistant') {
              message.messageAssistant = data.v as MessageAssistant;
            }
            if (data.type === 'final') {
              message.status = 'done';
              message.messageAssistant = data.v;
            }
          })
        );
      },
    },
  }));
};
