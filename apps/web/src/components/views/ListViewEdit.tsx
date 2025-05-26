import { api } from '@/lib/api/client';
import { ListStoreProvider } from '@/store/list';
import { PatchesStorePersister, PatchesStoreProvider } from '@/store/patches';
import { ListSearch } from '../List/ListSearch';

type Props = {
  editId?: string;
};

export const ListViewEdit = async ({ editId }: Props) => {
  const { data } = await api.GET('/v1/lists/getInitialData', {
    params: {
      query: { editId },
    },
  });

  return (
    <PatchesStoreProvider>
      <ListStoreProvider initialData={data}>
        <div className="pt-2 grid w-full grid-cols-[1fr_600px_1fr] items-center">
          <div></div>
          <ListSearch />
          <div></div>
        </div>
      </ListStoreProvider>
      <PatchesStorePersister />
    </PatchesStoreProvider>
  );
};
