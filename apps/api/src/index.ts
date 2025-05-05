import { createApp, openApiDocs } from '@/lib/config';
import { router as listsRouter } from '@/routes/lists/lists.index';
import { router as moviesRouter } from '@/routes/movies/movies.index';

const app = createApp();

openApiDocs(app);

app.route('/lists', listsRouter);
app.route('/movies', moviesRouter);

export default app;
