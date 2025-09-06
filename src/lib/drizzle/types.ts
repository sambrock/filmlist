import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { chats, messages, movies, users } from './schema';

export type User = z.infer<typeof UserSchema>;
export const UserSchema = createSelectSchema(users).omit({ createdAt: true, updatedAt: true });

export type Chat = z.infer<typeof ChatSchema>;
export const ChatSchema = createSelectSchema(chats);

export type Movie = z.infer<typeof MovieSchema>;
export const MovieSchema = createSelectSchema(movies);

export type Message = z.infer<typeof MessageSchema>;
export const MessageSchema = createSelectSchema(messages);

export type MessageUser = z.infer<typeof MessageUserSchema>;
export const MessageUserSchema = MessageSchema.extend({ role: z.literal('user') }).omit({
  parentId: true,
  serial: true,
  structured: true,
});

export type MessageAssistant = z.infer<typeof MessageAssistantSchema>;
export const MessageAssistantSchema = MessageSchema.extend({
  role: z.literal('assistant'),
  movies: MovieSchema.extend({
    watched: z.boolean().default(false),
    liked: z.boolean().default(false),
    watchlist: z.boolean().default(false),
  }).array(),
}).omit({ serial: true });

export type ModelResponseStructured = z.infer<typeof ModelResponseStructuredSchema>;
export const ModelResponseStructuredSchema = z.object({
  tmdbId: z.number(),
  title: z.string(),
  releaseYear: z.string(),
  why: z.string(),
});
