import { AppRouteHandler } from '@/lib/openapi';

import { SearchMoviesRoute } from '../movies.routes';

export const searchMovies: AppRouteHandler<SearchMoviesRoute> = async (c) => {
  return c.json([{ title: 'Inception' }]);
};
