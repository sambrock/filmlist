import { activityRouter } from './activity/activity.router';
import { movieRouter } from './movies/movies.router';
import { mergeRouters } from './trpc';

export const appRouter = mergeRouters(activityRouter, movieRouter);
export type AppRouter = typeof appRouter;
