import { DrizzleDatabase } from '@filmlist/drizzle';
export interface Context {
    env: {
        DB: {};
    };
    db: DrizzleDatabase;
    user: {
        id: number;
        username: string;
    };
}
export declare const procedure: import("@trpc/server/unstable-core-do-not-import").ProcedureBuilder<Context, object, object, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, false>;
export declare const router: <TInput extends import("@trpc/server/unstable-core-do-not-import").CreateRouterOptions>(input: TInput) => import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
    ctx: Context;
    meta: object;
    errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
    transformer: true;
}, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<TInput>>;
export declare const mergeRouters: typeof import("@trpc/server/unstable-core-do-not-import").mergeRouters;
export declare const middlewareAuth: import("@trpc/server/unstable-core-do-not-import").MiddlewareBuilder<Context, object, {
    user: {
        id: number;
        username: string;
    };
    env: {
        DB: {};
    };
    db: import("drizzle-orm/d1").DrizzleD1Database<{
        listMovies: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
            name: "list_movies";
            schema: undefined;
            columns: {
                listId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "listId";
                    tableName: "list_movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                movieId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "movieId";
                    tableName: "list_movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                order: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "order";
                    tableName: "list_movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                createdAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "createdAt";
                    tableName: "list_movies";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
            };
            dialect: "sqlite";
        }>;
        listMoviesRelations: import("drizzle-orm").Relations<"list_movies", {
            list: import("drizzle-orm").One<"lists", true>;
            movie: import("drizzle-orm").One<"movies", true>;
        }>;
        lists: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
            name: "lists";
            schema: undefined;
            columns: {
                listId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "listId";
                    tableName: "lists";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: true;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                readId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "readId";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: 12;
                }>;
                editId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "editId";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: 22;
                }>;
                title: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "title";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                description: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "description";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                locked: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "locked";
                    tableName: "lists";
                    dataType: "boolean";
                    columnType: "SQLiteBoolean";
                    data: boolean;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                owner: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "owner";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                createdAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "createdAt";
                    tableName: "lists";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                updatedAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "updatedAt";
                    tableName: "lists";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                lastUpdate: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "lastUpdate";
                    tableName: "lists";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
            };
            dialect: "sqlite";
        }>;
        moviesRelations: import("drizzle-orm").Relations<"movies", {
            listMovies: import("drizzle-orm").Many<"list_movies">;
        }>;
        movies: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
            name: "movies";
            schema: undefined;
            columns: {
                movieId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "movieId";
                    tableName: "movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: true;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                tmdbId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "tmdbId";
                    tableName: "movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                title: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "title";
                    tableName: "movies";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                posterPath: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "posterPath";
                    tableName: "movies";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                releaseDate: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "releaseDate";
                    tableName: "movies";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                slug: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "slug";
                    tableName: "movies";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                createdAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "createdAt";
                    tableName: "movies";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
            };
            dialect: "sqlite";
        }>;
        listRelations: import("drizzle-orm").Relations<"lists", {
            listMovies: import("drizzle-orm").Many<"list_movies">;
        }>;
    }> & {
        $client: {};
    };
}, unknown>;
export declare const middlewareDatabase: import("@trpc/server/unstable-core-do-not-import").MiddlewareBuilder<Context, object, {
    db: import("drizzle-orm/d1").DrizzleD1Database<{
        listMovies: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
            name: "list_movies";
            schema: undefined;
            columns: {
                listId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "listId";
                    tableName: "list_movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                movieId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "movieId";
                    tableName: "list_movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                order: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "order";
                    tableName: "list_movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                createdAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "createdAt";
                    tableName: "list_movies";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
            };
            dialect: "sqlite";
        }>;
        listMoviesRelations: import("drizzle-orm").Relations<"list_movies", {
            list: import("drizzle-orm").One<"lists", true>;
            movie: import("drizzle-orm").One<"movies", true>;
        }>;
        lists: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
            name: "lists";
            schema: undefined;
            columns: {
                listId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "listId";
                    tableName: "lists";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: true;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                readId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "readId";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: 12;
                }>;
                editId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "editId";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: 22;
                }>;
                title: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "title";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                description: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "description";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                locked: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "locked";
                    tableName: "lists";
                    dataType: "boolean";
                    columnType: "SQLiteBoolean";
                    data: boolean;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                owner: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "owner";
                    tableName: "lists";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                createdAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "createdAt";
                    tableName: "lists";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                updatedAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "updatedAt";
                    tableName: "lists";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                lastUpdate: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "lastUpdate";
                    tableName: "lists";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
            };
            dialect: "sqlite";
        }>;
        moviesRelations: import("drizzle-orm").Relations<"movies", {
            listMovies: import("drizzle-orm").Many<"list_movies">;
        }>;
        movies: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
            name: "movies";
            schema: undefined;
            columns: {
                movieId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "movieId";
                    tableName: "movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: true;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                tmdbId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "tmdbId";
                    tableName: "movies";
                    dataType: "number";
                    columnType: "SQLiteInteger";
                    data: number;
                    driverParam: number;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
                title: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "title";
                    tableName: "movies";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                posterPath: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "posterPath";
                    tableName: "movies";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                releaseDate: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "releaseDate";
                    tableName: "movies";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                slug: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "slug";
                    tableName: "movies";
                    dataType: "string";
                    columnType: "SQLiteText";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {
                    length: undefined;
                }>;
                createdAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                    name: "createdAt";
                    tableName: "movies";
                    dataType: "date";
                    columnType: "SQLiteTimestamp";
                    data: Date;
                    driverParam: number;
                    notNull: true;
                    hasDefault: true;
                    isPrimaryKey: false;
                    isAutoincrement: false;
                    hasRuntimeDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                    identity: undefined;
                    generated: undefined;
                }, {}, {}>;
            };
            dialect: "sqlite";
        }>;
        listRelations: import("drizzle-orm").Relations<"lists", {
            listMovies: import("drizzle-orm").Many<"list_movies">;
        }>;
    }> & {
        $client: {};
    };
    env: {
        DB: {};
    };
    user: {
        id: number;
        username: string;
    };
}, unknown>;
