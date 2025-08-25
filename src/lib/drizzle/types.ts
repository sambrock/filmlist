import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { messages, movies, threads, users } from './schema';

export type User = z.infer<typeof UserSchema>;
export type UserInsert = z.infer<typeof UserInsertSchema>;
export type Thread = z.infer<typeof ThreadSchema>;
export type ThreadInsert = z.infer<typeof ThreadInsertSchema>;
export type Movie = z.infer<typeof MovieSchema>;
export type MovieInsert = z.infer<typeof MovieInsertSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type MessageInsert = z.infer<typeof MessageInsertSchema>;
export type MessageUser = z.infer<typeof MessageUserSchema>;
export type MessageAssistant = z.infer<typeof MessageAssistantSchema>;
export type MessageStatus = Message['status'];
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type MessageStructured = z.infer<typeof MessageStructuredSchema>;

export const UserSchema = createSelectSchema(users);
export const UserInsertSchema = createInsertSchema(users);

export const ThreadSchema = createSelectSchema(threads);
export const ThreadInsertSchema = createInsertSchema(threads);

export const MovieSchema = createSelectSchema(movies);
export const MovieInsertSchema = createInsertSchema(movies);

export const MessageSchema = createSelectSchema(messages);
export const MessageInsertSchema = createInsertSchema(messages);

export const MessageStructuredSchema = z.object({
  tmdbId: z.number(),
  title: z.string(),
  releaseYear: z.string(),
  why: z.string(),
});

export const MessageUserSchema = MessageSchema.extend({ role: z.literal('user') }).omit({
  serial: true,
  structured: true,
  parentId: true,
  model: true,
});

export const MessageAssistantSchema = MessageSchema.extend({ role: z.literal('assistant') }).omit({
  serial: true,
});

export const ChatMessageSchema = z.object({
  user: MessageUserSchema,
  assistant: MessageAssistantSchema,
  movies: MovieSchema.array(),
});
