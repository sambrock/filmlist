import { GlobalStoreInitializer } from '@/store/global/global-store.provider';

export default async function HomePage() {
  
  return <GlobalStoreInitializer initialData={{}}></GlobalStoreInitializer>;
}
