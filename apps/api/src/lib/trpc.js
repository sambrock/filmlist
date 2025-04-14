"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareDatabase = exports.middlewareAuth = exports.mergeRouters = exports.router = exports.procedure = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
const drizzle_1 = require("@filmlist/drizzle");
const t = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
});
exports.procedure = t.procedure;
exports.router = t.router;
exports.mergeRouters = t.mergeRouters;
/* Middleware */
exports.middlewareAuth = t.middleware(({ ctx, next }) => {
    const user = { id: 1, username: 'username' }; // TODO: implement auth
    return next({
        ctx: { ...ctx, user },
    });
});
exports.middlewareDatabase = t.middleware(({ ctx, next }) => {
    let db = ctx.db;
    if (!db)
        db = (0, drizzle_1.initDrizzleDatabase)(ctx.env.DB);
    return next({
        ctx: { ...ctx, db },
    });
});
