import { enableMapSet, produce } from 'immer';

import { Model } from '@/lib/models';
import { GlobalState } from './global-store';

enableMapSet();

export type GlobalStoreAction =
  | {
      type: 'SET_ACTIVE_THREAD_ID';
      payload: { threadId: string };
    }
  | {
      type: 'SET_MODEL';
      payload: { threadId: string; model: Model };
    }
  | {
      type: 'SET_INPUT_VALUE';
      payload: { threadId: string; value?: string; isPersisted: boolean };
    }
  | {
      type: 'SET_MESSAGE_PENDING_CONTENT';
      payload: { messageId: string; content?: string; append?: boolean };
    }
  | {
      type: 'MESSAGE_PENDING';
      payload: { threadId: string; isPersisted: boolean };
    }
  | {
      type: 'MESSAGE_DONE';
      payload: { threadId: string };
    };

export const reducer = (state: GlobalState, { type, payload }: GlobalStoreAction) => {
  switch (type) {
    case 'SET_ACTIVE_THREAD_ID': {
      return produce(state, (draft) => {
        draft.activeThreadId = payload.threadId;
        draft.chatUnseenUpdates.delete(payload.threadId);
      });
    }
    case 'SET_MODEL': {
      return produce(state, (draft) => {
        draft.model = payload.model;
        draft.chatModel.set(payload.threadId, payload.model);
      });
    }
    case 'SET_INPUT_VALUE': {
      return produce(state, (draft) => {
        if (!payload.value) {
          draft.chatInputValue.delete(payload.threadId);
          draft.chatInputValue.delete('new');
          return;
        }
        if (!payload.isPersisted) {
          draft.chatInputValue.set('new', payload.value);
          return;
        }
        draft.chatInputValue.set(payload.threadId, payload.value);
      });
    }
    case 'SET_MESSAGE_PENDING_CONTENT': {
      return produce(state, (draft) => {
        if (!payload.content) {
          draft.messagePendingContent.delete(payload.messageId);
          return;
        }
        if (payload.append) {
          const existing = draft.messagePendingContent.get(payload.messageId) || '';
          draft.messagePendingContent.set(payload.messageId, existing + payload.content);
          return;
        }
        draft.messagePendingContent.set(payload.messageId, payload.content);
      });
    }
    case 'MESSAGE_PENDING': {
      return produce(state, (draft) => {
        draft.chatPending.add(payload.threadId);
        draft.chatInputValue.delete(payload.threadId);
        if (!payload.isPersisted) {
          draft.chatInputValue.delete('new');
        }
      });
    }
    case 'MESSAGE_DONE': {
      return produce(state, (draft) => {
        draft.chatPending.delete(payload.threadId);
        if (draft.activeThreadId !== payload.threadId) {
          draft.chatUnseenUpdates.add(payload.threadId);
        }
      });
    }
    default: {
      return state;
    }
  }
};
