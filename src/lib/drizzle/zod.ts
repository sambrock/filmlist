import { z } from '@hono/zod-openapi';
import { createSchemaFactory } from 'drizzle-zod';

import { messages, movies, threads, users } from './schema';

const { createSelectSchema, createInsertSchema } = createSchemaFactory({ zodInstance: z });

export type User = typeof UserSchema._zod.output;
export type Thread = typeof ThreadSchema._zod.output;
export type Message = typeof MessageSchema._zod.output;
export type Movie = typeof MovieSchema._zod.output;

export type InsertUser = typeof InsertUserSchema._zod.input;
export type InsertThread = typeof InsertThreadSchema._zod.input;
export type InsertMessage = typeof InsertMessageSchema._zod.input;
export type InsertMovie = typeof InsertMovieSchema._zod.input;

export const UserSchema = createSelectSchema(users);
export const ThreadSchema = createSelectSchema(threads);
export const MessageSchema = createSelectSchema(messages);
export const MovieSchema = createSelectSchema(movies);

export const InsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});
export const InsertThreadSchema = createInsertSchema(threads).omit({
  createdAt: true,
  updatedAt: true,
});
export const InsertMessageSchema = createInsertSchema(messages).omit({
  createdAt: true,
  updatedAt: true,
});
export const InsertMovieSchema = createInsertSchema(movies).omit({
  createdAt: true,
});
