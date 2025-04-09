import { mergeRouters } from './lib/trpc';
import { listRouter } from './lists/lists.router';
import { movieRouter } from './movies/movies.router';

export const appRouter = mergeRouters(listRouter, movieRouter);

export type AppRouter = typeof appRouter;
