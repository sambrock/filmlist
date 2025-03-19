import { Context } from '@/routers/trpc';
import { and, eq } from 'drizzle-orm';

import { likes, ratings, watched } from '@filmlist/drizzle';
import {
  GetUserMovieActivityInput,
  LikeMovieInput,
  RateMovieInput,
  WatchMovieInput,
} from './activity.schema';


export const getUserMovieActivity = async (input: GetUserMovieActivityInput, ctx: Context) => {
  const { movieId } = input;
  const { db, user } = ctx;

  const [watched, liked, rating] = await Promise.all([
    db.query.watched.findFirst({
      where: (watched) => and(eq(watched.userId, user.id), eq(watched.movieId, movieId)),
    }),
    db.query.likes.findFirst({
      where: (likes) => and(eq(likes.userId, user.id), eq(likes.movieId, movieId)),
    }),
    db.query.ratings.findFirst({
      where: (ratings) => and(eq(ratings.userId, user.id), eq(ratings.movieId, movieId)),
    }),
  ]);

  return {
    watched: !!watched,
    liked: !!liked,
    rating: rating?.rating ?? 0,
  };
};

export const watchMovie = (input: WatchMovieInput, ctx: Context) => {
  const { movieId } = input;
  const { db, user } = ctx;

  if (input.watched) {
    return db.insert(watched).values({ movieId, userId: user.id });
  } else {
    return db.delete(watched).where(and(eq(watched.movieId, movieId), eq(watched.userId, user.id)));
  }
};

export const likeMovie = (input: LikeMovieInput, ctx: Context) => {
  const { movieId, liked } = input;
  const { db, user } = ctx;

  if (liked) {
    return db.insert(likes).values({ movieId, userId: user.id });
  } else {
    return db.delete(likes).where(and(eq(likes.movieId, movieId), eq(likes.userId, user.id)));
  }
};

export const rateMovie = (input: RateMovieInput, ctx: Context) => {
  const { movieId, rating } = input;
  const { db, user } = ctx;

  return db
    .insert(ratings)
    .values({ movieId, userId: user.id, rating })
    .onConflictDoUpdate({
      target: [ratings.movieId, ratings.userId],
      set: { rating },
      targetWhere: and(eq(ratings.movieId, movieId), eq(ratings.userId, user.id)),
    });
};
