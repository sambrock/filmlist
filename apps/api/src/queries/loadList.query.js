"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadList = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = __importDefault(require("zod"));
const trpc_1 = require("../lib/trpc");
exports.loadList = trpc_1.procedure
    .use(trpc_1.middlewareDatabase)
    .input(zod_1.default.string())
    .query(async ({ input, ctx }) => {
    const data = await ctx.db.query.lists.findFirst({
        where: (list) => (0, drizzle_orm_1.eq)(list.editId, input),
        with: {
            listMovies: {
                limit: 50,
                with: {
                    movie: true,
                },
            },
        },
    });
    if (!data) {
        throw new Error('List not found');
    }
    const { listMovies, ...list } = data;
    return {
        list,
        movies: listMovies.map(({ order, movie }) => {
            return { ...movie, order };
        }),
    };
});
