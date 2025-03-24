import { mergeRouters } from '@/lib/trpc';
import { activityRouter } from '@/routers/activity/activity.router';
import { movieRouter } from '@/routers/movies/movies.router';

export const appRouter = mergeRouters(activityRouter, movieRouter);

export type AppRouter = typeof appRouter;
