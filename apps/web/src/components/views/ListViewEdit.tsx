import { api } from '@/lib/api/client';
import { ListStoreProvider } from '@/store/list';
import { PatchesStorePersister, PatchesStoreProvider } from '@/store/patches';
import { ListSearch } from '../List/ListSearch';
import { ListToolbar } from '../List/ListToolbar/ListToolbar';

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
        <div className="flex flex-col">
          <ListToolbar />
          <ListSearch className="fixed bottom-6 left-1/2 ml-[120px] w-[600px] -translate-x-1/2" />
        </div>
      </ListStoreProvider>
      <PatchesStorePersister />
    </PatchesStoreProvider>
  );
};
