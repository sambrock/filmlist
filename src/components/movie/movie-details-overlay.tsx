'use client';

import { useRouter } from 'next/navigation';

import { useMovieDetailsContext } from '@/providers/movie-details-context-provider';

export const MovieDetailsOverlay = () => {
  const { isIntercepted } = useMovieDetailsContext();

  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 h-screen w-screen bg-black/60"
      onClick={() => {
        if (isIntercepted) {
          router.back();
        } else {
          router.push(`/`);
        }
      }}
    ></div>
  );
};
