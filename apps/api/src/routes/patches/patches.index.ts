import { createRouter } from '@/lib/config';
import * as handlers from './patches.handlers';
import * as routes from './patches.routes';

export const router = createRouter().openapi(routes.savePatches, handlers.savePatches);
