import { GlobalStoreInitializer } from '@/store/global';
import { ListStoreProvider } from '@/store/list';
import { PatchesStoreProvider, PatchesStoreQueueManager } from '@/store/patches';
import { ListView } from '@/components/views/ListView/ListView';

export default async function HomePage() {
  return (
    <GlobalStoreInitializer initialData={{}}>
      <PatchesStoreProvider>
        <ListStoreProvider>
          <ListView />
        </ListStoreProvider>
        <PatchesStoreQueueManager />
      </PatchesStoreProvider>
    </GlobalStoreInitializer>
  );
}
