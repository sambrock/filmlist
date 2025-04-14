"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListMovie = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = __importDefault(require("zod"));
const drizzle_1 = require("@filmlist/drizzle");
const utils_1 = require("@filmlist/lib/utils");
const tmdb_1 = require("@filmlist/tmdb");
const trpc_1 = require("../lib/trpc");
exports.createListMovie = trpc_1.procedure
    .use(trpc_1.middlewareDatabase)
    .input(zod_1.default.object({
    editId: zod_1.default.string(),
    tmdbId: zod_1.default.number(),
}))
    .mutation(async ({ input, ctx }) => {
    const movie = await tmdb_1.tmdb.client.GET('/3/movie/{movie_id}', {
        params: {
            path: {
                movie_id: input.tmdbId,
            },
        },
    });
    if (!movie || !movie.data) {
        throw new Error('Movie not found');
    }
    const [{ movieId }] = await ctx.db
        .insert(drizzle_1.movies)
        .values({
        tmdbId: movie.data.id,
        title: movie.data.title,
        overview: movie.data.overview,
        posterPath: movie.data.poster_path,
        backdropPath: movie.data.backdrop_path,
        releaseDate: movie.data.release_date,
        slug: (0, utils_1.createUrlSlug)(movie.data.title),
    })
        .returning({ movieId: drizzle_1.movies.movieId });
    const list = await ctx.db.query.lists.findFirst({
        where: (list) => (0, drizzle_orm_1.eq)(list.editId, input.editId),
    });
    if (!list) {
        throw new Error('List not found');
    }
    await ctx.db.insert(drizzle_1.listMovies).values({
        listId: list.listId,
        movieId: movieId,
        order: 1,
    });
});
