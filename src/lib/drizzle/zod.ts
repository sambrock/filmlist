import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { messages, movies, recommendations, threads } from './schema';

export type Thread = z.infer<typeof ThreadSchema>;
export type ThreadInsert = z.infer<typeof ThreadInsertSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type MessageInsert = z.infer<typeof MessageInsertSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type RecommendationInsert = z.infer<typeof RecommendationInsertSchema>;
export type Movie = z.infer<typeof MovieSchema>;
export type MovieInsert = z.infer<typeof MovieInsertSchema>;

export type MessageUserPending = z.infer<typeof MessageUserPendingSchema>;
export type MessageAssistantPending = z.infer<typeof MessageAssistantPendingSchema>;
export type MessageUser = z.infer<typeof MessageUserSchema>;
export type MessageAssistant = z.infer<typeof MessageAssistantSchema>;

export const ThreadSchema = createSelectSchema(threads);
export const ThreadInsertSchema = createInsertSchema(threads);
export const MessageSchema = createSelectSchema(messages);
export const MessageInsertSchema = createInsertSchema(messages);
export const RecommendationSchema = createSelectSchema(recommendations);
export const RecommendationInsertSchema = createInsertSchema(recommendations);
export const MovieSchema = createSelectSchema(movies);
export const MovieInsertSchema = createInsertSchema(movies);

export const MessageUserPendingSchema = MessageSchema.pick({ content: true, role: true }).extend({
  role: z.literal('user'),
});
export const MessageAssistantPendingSchema = MessageSchema.pick({ content: true, role: true }).extend({
  role: z.literal('assistant'),
  recommendations: RecommendationSchema.extend({ movie: MovieSchema.optional() })
    .partial()
    .optional()
    .array(),
});
export const MessageUserSchema = MessageSchema.extend({
  role: z.literal('user'),
});
export const MessageAssistantSchema = MessageSchema.extend({
  role: z.literal('assistant'),
  recommendations: RecommendationSchema.extend({ movie: MovieSchema }).array(),
});
