'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useDebounceValue } from 'usehooks-ts';

import { api } from '@/lib/api/client';
import { Combobox } from '../common/Combobox';
import { IconAdd } from '../common/Icon';

export const ListSearch = () => {
  const [q, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [debounced] = useDebounceValue(q, 200);

  const { data } = useSWR(
    ['search', debounced],
    () =>
      q
        ? api.GET('/v1/movies/search', {
            params: {
              query: { q: debounced },
            },
          })
        : null,
    { keepPreviousData: true }
  );

  return (
    <div className="flex flex-col p-3">
      {selected}

      <Combobox items={data?.data || []} onItemSelect={(index) => setSelected(data!.data![index].title)}>
        <div className="relative mx-auto flex h-10 w-[600px] items-center">
          <IconAdd className="ml-3 self-center border-r border-[#323232]" />
          <Combobox.Input asChild>
            <input
              className="absolute top-0 left-0 h-10 w-full rounded-md border-2 border-[#323232] bg-[#323232]/70 px-3 pl-11 text-sm shadow-sm placeholder:text-neutral-500 focus:outline-none"
              placeholder="Add film"
              onChange={(e) => setQuery(e.target.value)}
            />
          </Combobox.Input>
        </div>

        <Combobox.Menu>
          {data?.data?.map((movie, index) => (
            <Combobox.MenuItem key={movie.tmdbId} index={index}>
              {movie.title}
            </Combobox.MenuItem>
          ))}
        </Combobox.Menu>
      </Combobox>
    </div>
  );
};
