import { createApp, enableOpenApiDocs } from '@/lib/config';
import { router as authRouter } from '@/routes/auth/auth.index';
import { router as listsRouter } from '@/routes/lists/lists.index';
import { router as moviesRouter } from '@/routes/movies/movies.index';
import { router as patchesRouter } from '@/routes/patches/patches.index';

const app = createApp();

enableOpenApiDocs(app);

app.route('/auth', authRouter);
app.route('/lists', listsRouter);
app.route('/movies', moviesRouter);
app.route('/patches', patchesRouter);

app.get('/init', (c) => {
  return c.json({});
});
app.post('/save', async (c) => {
  const body = await c.req.json();
  console.log('save', body);
  return c.json({});
});

export default app;
