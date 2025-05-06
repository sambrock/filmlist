import { createApp, enableOpenApiDocs } from '@/lib/config';
import { router as authRouter } from '@/routes/auth/auth.index';
import { router as listsRouter } from '@/routes/lists/lists.index';
import { router as moviesRouter } from '@/routes/movies/movies.index';

const app = createApp();

enableOpenApiDocs(app);

app.route('/auth', authRouter);
app.route('/lists', listsRouter);
app.route('/movies', moviesRouter);

export default app;
