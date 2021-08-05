import { useState } from 'react';
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { getToken } from '../store/auth';

export const tokenConfig = (token) => {
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };

  if (token) config.headers['x-auth-token'] = token;
  return config;
};

const LIMIT = 40;

const unique = (value, index, self) => self.indexOf(value) === index;

export default function useMovies() {
  const [basedOn, setBasedOn] = useState([]);

  // const user = useSelector(getUser);
  const token = useSelector(getToken);

  const fetchMovies = ({ pageParam = 1 }) =>
    axios({
      method: 'POST',
      url: `/api/sambrock?page=${pageParam}&limit=${LIMIT}`,
      headers: tokenConfig(token).headers,
      data: { basedOn },
    });

  const fetchDefault = ({ pageParam = 1 }) => axios({ method: 'GET', url: '/api/movies/default' });

  return useInfiniteQuery('movies', token ? fetchMovies : fetchDefault, {
    getNextPageParam: (lastPage, pages) => lastPage.data.nextPage,
    select: (data) =>
      token
        ? {
            movies: data.pages.map((m) => m.data.results).flat(),
            hasMore: data.pages.reverse()[0].data.hasMore,
            basedOn: data.pages.reverse()[0].data.basedOn,
          }
        : { movies: data.pages.map((m) => m.data).flat() },
    onSuccess: (data) => (token ? setBasedOn([...basedOn, ...data.basedOn]) : null),
    cacheTime: Infinity,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
  });
}
