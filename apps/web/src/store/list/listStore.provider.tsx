'use client';

import { createContext, useRef } from 'react';

import { api } from '@/lib/api';
import { usePatchesStore } from '../patches';
import { createListStore } from './listStore.store';

export type ListStoreApi = ReturnType<typeof createListStore>;

export const ListStoreContext = createContext<ListStoreApi | undefined>(undefined);

export const ListStoreProvider = (props: React.PropsWithChildren) => {
  const pushPatches = usePatchesStore((state) => state.pushPatches);

  const storeRef = useRef<ListStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createListStore(pushPatches);

    // storeRef.current.subscribe((state) => console.log(state.list));

    // storeRef.current.subscribe(async (state) => {
    //   if (state._isInitialized) return;
    //   const { data } = await api.POST('/v1/lists/initializeList');
    //   if (!data) return;
    //   state.dispatch({
    //     type: 'INITIALIZE_LIST',
    //     payload: {
    //       listId: data.listId,
    //       editId: data.editId,
    //       readId: data.readId,
    //       title: data.title,
    //       description: data.description,
    //       locked: data.locked,
    //       owner: data.owner,
    //       createdAt: new Date(data.createdAt),
    //       updatedAt: new Date(data.updatedAt),
    //       lastUpdate: new Date(data.lastUpdate),
    //     },
    //   });
    // });
  }

  return <ListStoreContext.Provider value={storeRef.current}>{props.children}</ListStoreContext.Provider>;
};
