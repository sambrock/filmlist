import { and, eq } from 'drizzle-orm';

import { db, likes, ratings, watched } from '@filmlist/drizzle';
import { UserMovieActivity } from './activity.schema';

export const getUserMovieActivity = async (movieId: number, userId: number) => {
  const [watched, liked, rating, watchlist] = await Promise.all([
    db.query.watched.findFirst({
      where: (watched) => and(eq(watched.userId, userId), eq(watched.movieId, movieId)),
    }),
    db.query.likes.findFirst({
      where: (likes) => and(eq(likes.userId, userId), eq(likes.movieId, movieId)),
    }),
    db.query.ratings.findFirst({
      where: (ratings) => and(eq(ratings.userId, userId), eq(ratings.movieId, movieId)),
    }),
    db.query.watchlist.findFirst({
      where: (ratings) => and(eq(ratings.userId, userId), eq(ratings.movieId, movieId)),
    }),
  ]);

  return {
    watched: !!watched,
    liked: !!liked,
    watchlist: !!watchlist,
    rating: rating?.rating ?? 0,
  } satisfies UserMovieActivity;
};

export const watchMovie = async (movieId: number, userId: number, update: boolean) => {
  if (update) {
    await db.insert(watched).values({ movieId, userId });
  } else {
    await db.delete(watched).where(and(eq(watched.movieId, movieId), eq(watched.userId, userId)));
  }
};

export const likeMovie = async (movieId: number, userId: number, update: boolean) => {
  if (update) {
    await db.insert(likes).values({ movieId, userId });
  } else {
    await db.delete(likes).where(and(eq(likes.movieId, movieId), eq(likes.userId, userId)));
  }
};

export const rateMovie = async (movieId: number, userId: number, rating: number) => {
  await db
    .insert(ratings)
    .values({ movieId, userId, rating })
    .onConflictDoUpdate({
      target: [ratings.movieId, ratings.userId],
      set: { rating },
      targetWhere: and(eq(ratings.movieId, movieId), eq(ratings.userId, userId)),
    });
};
