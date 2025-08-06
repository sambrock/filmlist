import { MovieDetails } from '@/lib/tmdb';
import { uuid } from '@/lib/utils';
import { db } from '../db';
import { movies } from '../schema';

export const createMovie = async (source: MovieDetails) => {
  const [movie] = await db
    .insert(movies)
    .values({
      movieId: uuid(),
      tmdbId: source.id,
      source,
    })
    .onConflictDoUpdate({
      target: movies.tmdbId,
      set: { createdAt: new Date() },
    })
    .returning();

  return movie;
};
