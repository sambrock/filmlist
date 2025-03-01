'use client';

import { useMovieActivityStore } from '@/providers/MovieActivityStoreProvider';
import { StarsInput } from '../common/StarsInput';

export const MovieActionsRating = () => {
  const dispatch = useMovieActivityStore((s) => s.dispatch);
  const rating = useMovieActivityStore((s) => s.rating);

  return (
    <div>
      <StarsInput
        initialRating={rating}
        onRatingChange={(updated) => dispatch({ type: 'RATE', payload: { rating: updated } })}
      />
    </div>
  );
};
