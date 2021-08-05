import axios from 'axios';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { getToken } from '../store/auth';
import { tokenConfig } from './useMovies';

export default function useMovie(movieId) {
  const token = useSelector(getToken);

  const fetchMovie = () => axios({ method: 'GET', url: `/api/movies/${movieId}`, headers: tokenConfig(token).headers });

  return useQuery(['movie', movieId], fetchMovie, { keepPreviousData: true, select: (data) => ({ movie: data.data }) });
}
