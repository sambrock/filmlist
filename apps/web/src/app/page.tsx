import { cookies } from 'next/headers';

import { api } from '@/lib/api';
import { GlobalStoreInitializer } from '@/store/global';
import { ListStoreProvider } from '@/store/list';
import { PatchesStorePersister, PatchesStoreProvider } from '@/store/patches';
import { ListView } from '@/components/views/ListView/ListView';

export default async function HomePage() {
  const c = await cookies();
  const clientToken = c.get('client-token')?.value;

  const { data } = await api.GET('/v1/lists/getListInitialData', {
    credentials: 'include',
    headers: { 'client-token': clientToken },
  });

  return (
    <GlobalStoreInitializer initialData={{}}>
      <PatchesStoreProvider>
        <ListStoreProvider initialData={data}>
          <ListView />
        </ListStoreProvider>
        <PatchesStorePersister />
      </PatchesStoreProvider>
    </GlobalStoreInitializer>
  );
}
