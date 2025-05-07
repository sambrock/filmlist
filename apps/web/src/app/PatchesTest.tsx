'use client';

import { useRef } from 'react';
import { useEventListener } from 'usehooks-ts';

import { useListStore } from '@/store/list';
import { usePatchesStore } from '@/store/patches';

export const PatchesTest = () => {
  const title = useListStore((store) => (store.list ? store.list.title : ''));
  const dispatch = useListStore((store) => store.dispatch);

  const [undo, redo] = usePatchesStore((store) => [store.undo, store.redo]);

  useEventListener('keydown', (e) => {
    if (e.metaKey && e.shiftKey && e.key === 'z') {
      e.preventDefault();
      return redo();
    }
    if (e.metaKey && e.key === 'z') {
      e.preventDefault();
      return undo();
    }
  });

  const isInitializedRef = useRef(false);
  if (!isInitializedRef.current) {
    isInitializedRef.current = true;
    dispatch({
      type: 'INITIALIZE_LIST',
      payload: {
        list: {
          listId: 1,
          editId: '',
          readId: '',
          title: '',
          description: '',
          locked: false,
          owner: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastUpdate: new Date(),
        },
        movies: new Map(),
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>{title}</h1>

      <input
        onChange={(e) => {
          dispatch({ type: 'SET_TITLE', payload: e.target.value });
        }}
      />
    </div>
  );
};
