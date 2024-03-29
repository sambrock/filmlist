import { z } from 'zod';

import { handler } from '@/server/handler';
import type { Api } from '@/api/api.types';
import { searchMovies } from '@/server/movie/searchMovies';

export type GET_SearchMovies = Api.GetRoute<{
  url: '/api/v1/searchMovies';
  params: z.input<typeof queryParamsSchema>;
  data: Awaited<ReturnType<typeof searchMovies>>;
}>;

const queryParamsSchema = z.object({
  q: z.string().default(''),
  page: z
    .string()
    .default('1')
    .transform((v) => +v),
});

export default handler({
  async get(req, res) {
    const parsedQueryParams = queryParamsSchema.safeParse(req.query);
    if (!parsedQueryParams.success) return res.send([]);

    const data = await searchMovies(parsedQueryParams.data.q, parsedQueryParams.data.page);

    return res.send(data);
  },
});
