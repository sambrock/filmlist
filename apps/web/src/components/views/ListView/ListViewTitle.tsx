'use client';

import { useListStore } from '@/store/list';

type Props = React.ComponentProps<'h1'> & {};

export const ListViewTitle = (props: Props) => {
  const title = useListStore((store) => store.list.title);

  return <h1 {...props}>{title}</h1>;
};
