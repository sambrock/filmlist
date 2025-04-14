"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMovies = void 0;
const zod_1 = __importDefault(require("zod"));
const tmdb_1 = require("@filmlist/tmdb");
const trpc_1 = require("../lib/trpc");
exports.searchMovies = trpc_1.procedure
    .input(zod_1.default.object({
    query: zod_1.default.string(),
    year: zod_1.default
        .string()
        .length(4)
        .regex(/^\d{4}$/)
        .optional(),
}))
    .query(async ({ input }) => {
    const { data } = await tmdb_1.tmdb.client.GET('/3/search/movie', {
        params: {
            query: {
                query: input.query,
                year: input.year,
                primary_release_year: input.year,
                append_to_response: 'credits',
            },
        },
    });
    const results = data?.results?.slice(0, 5);
    if (!results) {
        throw new Error('');
    }
    // TODO: This is a bit of a hack, but it works for now
    const withDirectors = await Promise.all(results.map(async (m) => {
        const { data } = await tmdb_1.tmdb.client.GET('/3/movie/{movie_id}/credits', {
            params: {
                path: { movie_id: m.id },
            },
        });
        return {
            ...m,
            directors: data?.crew?.filter((person) => person.job === 'Director').map((person) => person.name) || [],
        };
    }));
    return withDirectors.map((movie) => ({
        tmdbId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        directors: movie.directors,
    }));
});
