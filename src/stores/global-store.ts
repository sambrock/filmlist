import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import { User } from '@/lib/auth';

export type State = {
  user?: User;
  model: string;
  messageInputValue?: string;
};

export type Actions = {
  setMessageInputValue: (value: string) => void;
};

export type GlobalStore = State & { actions: Actions };

export const createGlobalStore = (initState: { user?: User }) => {
  return createStore<GlobalStore>()((set) => ({
    user: initState.user,
    model: 'gpt-4',
    messageInputValue: '',

    actions: {
      setMessageInputValue: (value) => {
        set(
          produce((state: GlobalStore) => {
            state.messageInputValue = value;
          })
        );
      },
    },
  }));
};
