import { createRouter } from '@/lib/config';

import * as handlers from './movies.handlers';
import * as routes from './movies.routes';

export const router = createRouter().openapi(routes.searchMovies, handlers.searchMovies);
