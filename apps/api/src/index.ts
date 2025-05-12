import { createApp, enableOpenApiDocs } from '@/lib/config';
import { router as listsRouter } from '@/routes/lists/lists.index';
import { router as moviesRouter } from '@/routes/movies/movies.index';
import { router as patchesRouter } from '@/routes/patches/patches.index';

const app = createApp();

enableOpenApiDocs(app);

app.route('/lists', listsRouter);
app.route('/movies', moviesRouter);
app.route('/patches', patchesRouter);

export default app;
