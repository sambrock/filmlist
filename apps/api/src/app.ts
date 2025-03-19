import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { appRouter } from './routers/app.router';

const app = new Hono();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/trpc/*', trpcServer({ router: appRouter }));

export default app;
export type AppRouter = typeof appRouter;
