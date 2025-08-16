import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { messages, movies, threads, users } from './schema';

export type User = z.infer<typeof UserSchema>;
export type UserInsert = z.infer<typeof UserInsertSchema>;
export const UserSchema = createSelectSchema(users);
export const UserInsertSchema = createInsertSchema(users);

export type Thread = z.infer<typeof ThreadSchema>;
export type ThreadInsert = z.infer<typeof ThreadInsertSchema>;
export const ThreadSchema = createSelectSchema(threads);
export const ThreadInsertSchema = createInsertSchema(threads);

export type Message = z.infer<typeof MessageSchema>;
export type MessageInsert = z.infer<typeof MessageInsertSchema>;
export const MessageSchema = createSelectSchema(messages);
export const MessageInsertSchema = createInsertSchema(messages);

export type Movie = z.infer<typeof MovieSchema>;
export type MovieInsert = z.infer<typeof MovieInsertSchema>;
export const MovieSchema = createSelectSchema(movies);
export const MovieInsertSchema = createInsertSchema(movies);

export type MessageUser = z.infer<typeof MessageUserSchema>;
export type MessageAssistant = z.infer<typeof MessageAssistantSchema>;
export const MessageUserSchema = MessageSchema.extend({ role: z.literal('user') });
export const MessageAssistantSchema = MessageSchema.extend({
  role: z.literal('assistant'),
  movies: MovieSchema.array(),
});

export const MessageUserAssistantSchema = z.discriminatedUnion('role', [
  MessageUserSchema,
  MessageAssistantSchema,
]);

export type MessageStatus = Message['status'];

// export type MessageUser = z.infer<typeof MessageUserSchema>;
// export type MessageAssistant = z.infer<typeof MessageAssistantSchema>;
// export type Structured = z.infer<typeof StructuredSchema>;

// export const MessageUserSchema = MessageSchema.extend({
//   role: z.literal('user'),
//   parentId: z.null(),
//   parsed: z.null(),
// });

// export const MessageAssistantSchema = MessageSchema.extend({
//   role: z.literal('assistant'),
//   movies: MovieSchema.array(),
// });

// export const StructuredSchema = z.object({
//   tmdbId: z.number(),
//   title: z.string(),
//   releaseYear: z.string(),
//   why: z.string(),
// });
