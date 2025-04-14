"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeList = void 0;
const drizzle_1 = require("@filmlist/drizzle");
const trpc_1 = require("../lib/trpc");
exports.initializeList = trpc_1.procedure.use(trpc_1.middlewareDatabase).mutation(async ({ ctx }) => {
    const count = await ctx.db.$count(drizzle_1.lists);
    await ctx.db.insert(drizzle_1.lists).values({
        title: `Untitled #${count + 1}`,
        owner: 'test',
    });
});
