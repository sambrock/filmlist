import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { messages, movies, recommendations, threads } from './schema';

export const ThreadSchema = createSelectSchema(threads);
export const ThreadInsertSchema = createInsertSchema(threads);
export const MessageSchema = createSelectSchema(messages);
export const MessageInsertSchema = createInsertSchema(messages);
export const RecommendationSchema = createSelectSchema(recommendations);
export const RecommendationInsertSchema = createInsertSchema(recommendations);
export const MovieSchema = createSelectSchema(movies);
export const MovieInsertSchema = createInsertSchema(movies);
export const RecommendationWithMovieSchema = RecommendationSchema.extend({
  movie: MovieSchema.optional(),
});
export const MessageWithRecommendationsSchema = MessageSchema.extend({
  recommendations: RecommendationWithMovieSchema.array(),
});

export type Thread = z.infer<typeof ThreadSchema>;
export type ThreadInsert = z.infer<typeof ThreadInsertSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type MessageInsert = z.infer<typeof MessageInsertSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type RecommendationInsert = z.infer<typeof RecommendationInsertSchema>;
export type Movie = z.infer<typeof MovieSchema>;
export type MovieInsert = z.infer<typeof MovieInsertSchema>;
export type RecommendationWithMovie = z.infer<typeof RecommendationWithMovieSchema>;
export type MessageWithRecommendations = z.infer<typeof MessageWithRecommendationsSchema>;
