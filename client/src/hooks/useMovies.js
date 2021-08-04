import axios from 'axios';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { getToken, getUser } from '../store/auth';

export default function useMovies() {
  const user = useSelector(getUser);
  const token = useSelector(getToken);

  const tokenConfig = () => {
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };

    if (token) config.headers['x-auth-token'] = token;
    return config;
  };

  return useQuery('movies', () =>
    axios({ method: 'POST', url: '/api/sambrock?page=1&limit=40', headers: tokenConfig.headers, data: { basedOn: [] } })
  );
}
