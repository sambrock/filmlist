import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { messages, movies, threads, users } from './schema';

export const selectThreadSchema = createSelectSchema(threads);
export const selectMessageSchema = createSelectSchema(messages);

export const insertUserSchema = createInsertSchema(users);
export const insertThreadSchema = createInsertSchema(threads);
export const insertMessageSchema = createInsertSchema(messages);
export const insertMovieSchema = createInsertSchema(movies);
