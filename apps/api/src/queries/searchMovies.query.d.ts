export declare const searchMovies: import("@trpc/server").TRPCQueryProcedure<{
    input: {
        query: string;
        year?: string | undefined;
    };
    output: {
        tmdbId: number;
        title: string;
        posterPath: string;
        directors: string[];
    }[];
}>;
