export declare const loadList: import("@trpc/server").TRPCQueryProcedure<{
    input: string;
    output: {
        list: {
            listId: number;
            readId: string;
            editId: string;
            title: string;
            description: string;
            locked: boolean;
            owner: string;
            createdAt: Date;
            updatedAt: Date;
            lastUpdate: Date;
        };
        movies: {
            order: number;
            title: string;
            createdAt: Date;
            movieId: number;
            tmdbId: number;
            posterPath: string;
            releaseDate: string;
            slug: string;
        }[];
    };
}>;
