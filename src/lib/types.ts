import type { messages, movies, threads, users } from './drizzle/schema';

export type User = typeof users.$inferSelect;
export type Thread = typeof threads.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Movie = typeof movies.$inferSelect;
