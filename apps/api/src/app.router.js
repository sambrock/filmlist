"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./lib/trpc");
const createListMovie_mutation_1 = require("./mutations/createListMovie.mutation");
const initializeList_mutation_1 = require("./mutations/initializeList.mutation");
const loadList_query_1 = require("./queries/loadList.query");
const searchMovies_query_1 = require("./queries/searchMovies.query");
exports.appRouter = (0, trpc_1.router)({
    movies: {
        search: searchMovies_query_1.searchMovies,
    },
    list: {
        initialize: initializeList_mutation_1.initializeList,
        load: loadList_query_1.loadList,
        add: createListMovie_mutation_1.createListMovie,
    },
});
