import { z } from '@hono/zod-openapi';
import { createSchemaFactory } from 'drizzle-zod';

import { messages, movies, threads, users } from './schema';

const { createSelectSchema } = createSchemaFactory({ zodInstance: z });

export type User = typeof UserSchema._zod.output;
export type Thread = typeof ThreadSchema._zod.output;
export type Message = typeof MessageSchema._zod.output;
export type Movie = typeof MovieSchema._zod.output;

export const UserSchema = createSelectSchema(users).omit({ pk: true });
export const ThreadSchema = createSelectSchema(threads).omit({ pk: true, userFk: true });
export const MessageSchema = createSelectSchema(messages).omit({
  pk: true,
  threadFk: true,
  parentFk: true,
});
export const MovieSchema = createSelectSchema(movies).omit({ pk: true });

// export type InsertUser = typeof insertUserSchema._zod.input;
// export type InsertThread = typeof insertThreadSchema._zod.input;
// export type InsertMessage = typeof insertMessageSchema._zod.input;
// export type InsertMovie = typeof insertMovieSchema._zod.input;

// export const insertUserSchema = createInsertSchema(users).omit({
//   pk: true,
//   createdAt: true,
//   updatedAt: true,
// });
// export const insertThreadSchema = createInsertSchema(threads).omit({
//   pk: true,
//   userFk: true,
//   createdAt: true,
//   updatedAt: true,
// });
// export const insertMessageSchema = createInsertSchema(messages).omit({
//   pk: true,
//   parentFk: true,
//   threadFk: true,
//   createdAt: true,
//   updatedAt: true,
// });
// export const insertMovieSchema = createInsertSchema(movies).omit({
//   pk: true,
//   createdAt: true,
//   updatedAt: true,
// });
