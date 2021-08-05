import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

const LIMIT = 40;

export default function useSeenMovies(username, page) {
  const fetchSeen = ({ pageParam = 1 }) =>
    axios({ method: 'GET', url: `/api/${username}/seen?page=${pageParam}&limit=${LIMIT}` });

  return useInfiniteQuery('seen', fetchSeen, {
    getNextPageParam: (lastPage, pages) => lastPage.data.nextPage,
  });
}
