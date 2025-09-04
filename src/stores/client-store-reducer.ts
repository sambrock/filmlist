import { produce } from 'immer';

import { ClientChatState, ClientState } from './client-store';

export type ClientStateAction =
  | { type: 'INIT_CHAT'; payload: { chatId: string; isPersisted: boolean } }
  | { type: 'UPDATE_CHAT'; payload: Partial<ClientChatState> }
  | { type: 'CHAT_MESSAGE_INPUT'; payload: { chatId: string; value: string } }
  | { type: 'CHAT_MESSAGE_PENDING'; payload: { chatId: string } }
  | { type: 'CHAT_MESSAGE_DONE'; payload: { chatId: string } };

export const reducer = (state: ClientState, { type, payload }: ClientStateAction) => {
  switch (type) {
    case 'INIT_CHAT': {
      return produce(state, (draft) => {
        draft.chats.push({
          chatId: payload.chatId,
          model: state.model,
          inputValue: '',
          isPersisted: payload.isPersisted,
          isPending: false,
        });
      });
    }
    case 'UPDATE_CHAT': {
      return produce(state, (draft) => {
        const { chatId, ...updates } = payload;
        const chat = draft.chats.find((c) => c.chatId === chatId);
        if (!chat) return;
        Object.assign(chat, updates);
      });
    }
    case 'CHAT_MESSAGE_INPUT': {
      return produce(state, (draft) => {
        const chat = draft.chats.find((c) => c.chatId === payload.chatId);
        if (!chat) return;
        chat.inputValue = payload.value;
      });
    }
    case 'CHAT_MESSAGE_PENDING': {
      return produce(state, (draft) => {
        const chat = draft.chats.find((c) => c.chatId === payload.chatId);
        if (!chat) return;
        chat.isPending = true;
        chat.inputValue = '';
      });
    }
    case 'CHAT_MESSAGE_DONE': {
      return produce(state, (draft) => {
        const chat = draft.chats.find((c) => c.chatId === payload.chatId);
        if (!chat) return;
        chat.isPending = true;
        chat.isPersisted = true;
      });
    }
    default: {
      return state;
    }
  }
};
