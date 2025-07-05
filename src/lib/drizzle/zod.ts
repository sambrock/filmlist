import { z } from '@hono/zod-openapi';

export type Message = z.infer<typeof MessageSchema>;
export type Movie = z.infer<typeof MovieSchema>;

export const MessageSchema = z.object({
  messageId: z.string(),
  threadId: z.string(),
  parentId: z.string().nullable(),
  content: z.string(),
  role: z.enum(['user', 'assistant']),
  model: z.string(),
  createdAt: z.date().or(z.string()).openapi({ type: 'string', format: 'date-time' }),
  updatedAt: z.date().or(z.string()).openapi({ type: 'string', format: 'date-time' }),
});

export const MovieSchema = z.object({
  movieId: z.string(),
  tmdbId: z.number(),
  title: z.string(),
  releaseDate: z.date().or(z.string()).openapi({ type: 'string', format: 'date-time' }),
  posterPath: z.string(),
  backdropPath: z.string(),
  createdAt: z.date().or(z.string()).openapi({ type: 'string', format: 'date-time' }),
});
