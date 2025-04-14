export declare const appRouter: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
    ctx: import("./lib/trpc").Context;
    meta: object;
    errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
    transformer: true;
}, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
    movies: {
        search: import("@trpc/server").TRPCQueryProcedure<{
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
    };
    list: {
        initialize: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: void;
        }>;
        load: import("@trpc/server").TRPCQueryProcedure<{
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
        add: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                editId: string;
                tmdbId: number;
            };
            output: void;
        }>;
    };
}>>;
export type AppRouter = typeof appRouter;
