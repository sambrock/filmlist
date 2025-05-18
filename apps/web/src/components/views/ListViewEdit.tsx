import { api } from '@/lib/api/client';
import { ListStoreProvider } from '@/store/list';
import { PatchesStorePersister, PatchesStoreProvider } from '@/store/patches';
import { ListMovieSearch } from '../ListMovieSearch/ListMovieSearch';
import { ListTitleStatic } from '../ListTitle/ListTitleStatic';

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
        <div>
          <ListTitleStatic initialTitle={'Test'} />
          <ListMovieSearch className="fixed bottom-6 left-1/2 w-[600px] -translate-x-1/2" />
        </div>
      </ListStoreProvider>
      <PatchesStorePersister />
    </PatchesStoreProvider>
  );
};
