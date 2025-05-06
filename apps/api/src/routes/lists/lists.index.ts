import { createRouter } from '@/lib/config';

import * as handlers from './lists.handlers';
import * as routes from './lists.routes';

export const router = createRouter()
  .openapi(routes.findList, handlers.findList)
  .openapi(routes.initializeList, handlers.initializeList);
