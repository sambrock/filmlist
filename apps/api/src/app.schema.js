"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMovieSchema = exports.ListSchema = exports.MovieSchema = void 0;
const zod_1 = require("zod");
exports.MovieSchema = zod_1.z.object({
    sourceId: zod_1.z.number(),
    title: zod_1.z.string(),
    overview: zod_1.z.string(),
    releaseDate: zod_1.z.string(),
    posterPath: zod_1.z.string(),
    backdropPath: zod_1.z.string(),
});
exports.ListSchema = zod_1.z.object({
    publicId: zod_1.z.string(),
    title: zod_1.z.string(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.ListMovieSchema = zod_1.z.object({
    movieId: zod_1.z.number(),
    title: zod_1.z.string(),
    releaseDate: zod_1.z.string(),
    posterPath: zod_1.z.string(),
    order: zod_1.z.number(),
});
