import axios from 'axios';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';

import { tokenConfig } from './useMovies';
import { getToken, getUser } from '../store/auth';

export default function useRating() {
  const user = useSelector(getUser);
  const token = useSelector(getToken);

  const mutate = ({ movieId, rating }) =>
    axios({
      method: 'POST',
      url: `/api/${user.username}/ratings`,
      headers: tokenConfig(token).headers,
      data: { movieId, rating },
    });

  return useMutation((request) => mutate(request));
}
