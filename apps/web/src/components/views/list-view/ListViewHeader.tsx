import { useListStore } from '../../../stores/useListStore';

export const ListViewHeader = () => {
  const list = useListStore((s) => s.list);

  return (
    <div className="px-8">
      <h1 className="text-4xl font-black text-neutral-300">{list.title}</h1>
    </div>
  );
};
