import { createRouter } from '@/lib/config';

import * as handlers from './auth.handlers';
import * as routes from './auth.routes';

export const router = createRouter().openapi(routes.initializeClient, handlers.initializeClient);
