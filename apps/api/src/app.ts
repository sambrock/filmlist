import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { appRouter } from './app.router';

const app = new Hono();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/api/*', trpcServer({ router: appRouter }));

export default app;
