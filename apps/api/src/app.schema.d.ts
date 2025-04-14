import { z } from 'zod';
export type Movie = z.infer<typeof MovieSchema>;
export type List = z.infer<typeof ListSchema>;
export type ListMovie = z.infer<typeof ListMovieSchema>;
export declare const MovieSchema: z.ZodObject<{
    sourceId: z.ZodNumber;
    title: z.ZodString;
    overview: z.ZodString;
    releaseDate: z.ZodString;
    posterPath: z.ZodString;
    backdropPath: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    posterPath: string;
    releaseDate: string;
    overview: string;
    backdropPath: string;
    sourceId: number;
}, {
    title: string;
    posterPath: string;
    releaseDate: string;
    overview: string;
    backdropPath: string;
    sourceId: number;
}>;
export declare const ListSchema: z.ZodObject<{
    publicId: z.ZodString;
    title: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    createdAt: string;
    updatedAt: string;
    publicId: string;
}, {
    title: string;
    createdAt: string;
    updatedAt: string;
    publicId: string;
}>;
export declare const ListMovieSchema: z.ZodObject<{
    movieId: z.ZodNumber;
    title: z.ZodString;
    releaseDate: z.ZodString;
    posterPath: z.ZodString;
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    movieId: number;
    posterPath: string;
    releaseDate: string;
    order: number;
}, {
    title: string;
    movieId: number;
    posterPath: string;
    releaseDate: string;
    order: number;
}>;
