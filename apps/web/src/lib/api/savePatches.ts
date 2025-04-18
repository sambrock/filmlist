import { type Patch } from 'immer';

import { type ListStoreState } from '../../stores/useListStore/useListStore.store';
import { trpc } from './trpc';

export const saveListPatches = async (state: ListStoreState, patches: Patch[]) => {
  for (const patch of patches) {
    const { path, op, value } = patch;

    switch (op) {
      case 'add': {
        if (path[0] === 'movies') {
          await trpc.list.add.mutate({
            listId: state.list.listId,
            movieId: path[1] as number,
            order: value.order,
          });
        }
        break;
      }
      case 'remove': {
        if (path[0] === 'movies') {
          await trpc.list.remove.mutate({
            listId: state.list.listId,
            movieId: path[1] as number,
          });
        }
        break;
      }
      default: {
        break;
      }
    }
  }
};
