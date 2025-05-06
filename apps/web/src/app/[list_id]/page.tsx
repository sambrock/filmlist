import { cookies, headers } from 'next/headers';

import { api } from '@/lib/api';
import { GlobalStoreInitializer } from '@/store/global/global-store.provider';

type Props = {
  params: Promise<{
    list_id: string;
  }>;
};

export default async function ListPage(props: Props) {
  const { list_id } = await props.params;

  const { data, response } = await api.POST('/v1/lists/initializeList');

  if (!data) {
    throw new Error('Error initializing list');
  }

  const h = await headers();

  h.set('set-cookie', response.headers.get('set-cookie') || '');

  return (
    <GlobalStoreInitializer
      initialData={{ clientId: data.owner }}
    >
      {data?.editId}
    </GlobalStoreInitializer>
  );
}
