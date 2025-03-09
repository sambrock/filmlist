'use client';

import { useMovieActivityStore } from '@/providers/MovieActivityStoreProvider';
import { StarsInput } from '../common/StarsInput';

export const MovieActionsRatingInput = () => {
  const dispatch = useMovieActivityStore((s) => s.dispatch);
  const rating = useMovieActivityStore((s) => s.rating);

  return (
    <div className="h-input-sm flex items-center px-2">
      <StarsInput
        initialRating={rating}
        onRatingChange={(updated) => dispatch({ type: 'RATE', payload: { rating: updated } })}
      />
    </div>
  );
};
