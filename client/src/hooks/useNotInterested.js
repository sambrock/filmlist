import axios from 'axios';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';

import { tokenConfig } from './useMovies';
import { getToken, getUser } from '../store/auth';

export default function useNotInterested() {
  const user = useSelector(getUser);
  const token = useSelector(getToken);

  const mutate = ({ method, movieId }) =>
    axios({
      method: method,
      url: `/api/${user.username}/not-interested`,
      headers: tokenConfig(token).headers,
      data: { movieId },
    });

  return useMutation((request) => mutate(request));
}
