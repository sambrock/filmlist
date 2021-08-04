import axios from 'axios';
import { useQuery } from 'react-query';

export default function useSeen(username) {
  return useQuery('seen', () => 
    axios({
      method: 'GET',
      url: `/api/${username}/seen?page=1&limit=40`,
    })
  );
}
