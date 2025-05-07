import { GlobalStoreInitializer } from '@/store/global';
import { ListStoreProvider } from '@/store/list';
import { PatchesStoreProvider } from '@/store/patches';

import { PatchesTest } from './PatchesTest';

export default async function HomePage() {
  return (
    <GlobalStoreInitializer initialData={{}}>
      <PatchesStoreProvider>
        <ListStoreProvider>
          <PatchesTest />
        </ListStoreProvider>
      </PatchesStoreProvider>
    </GlobalStoreInitializer>
  );
}
