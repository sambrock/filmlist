import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

const LIMIT = 20;

export default function useWatchlistMovies(username, page) {
  const fetchWatchlist = ({ pageParam = 1 }) =>
    axios({ method: 'GET', url: `/api/${username}/watchlist?page=${pageParam}&limit=${LIMIT}` });

  return useInfiniteQuery('watchlist', fetchWatchlist, {
    getNextPageParam: (lastPage, pages) => lastPage.data.nextPage,
  });
}
