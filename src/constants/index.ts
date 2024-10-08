export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
export const NANO_ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
export const NANO_ID_LENGTH = 12;
export const MAX_SEARCH_RESULTS = 4;
export const MAX_LIST_MOVIES = 28;
export const SESSION_ID_LENGTH = 24;
export const SESSION_TOKEN_NAME = 'session_token';
export const MAX_DESCRIPTION_LENGTH = 3000;
export const MAX_DESCRIPTION_PREVIEW_LENGTH = 450;
export const MAX_TITLE_LENGTH = 200;
export const LIST_TOKEN_NAME = 'list_token';
export const DEFAULT_TITLE = (prefix?: string) => (prefix ? `${prefix} - FILMLIST` : 'FILMLIST');

export const BASE_URL = (() => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return `https://${process.env.NEXT_PUBLIC_BASE_URL}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return 'http://localhost:3000';
})();

export const MOVIE_IMAGE_URL = {
  poster: {
    w92: 'https://image.tmdb.org/t/p/w92',
    w342: {
      default: 'https://nyvdxnvxqlmwhkfdukqn.supabase.co/storage/v1/object/public/media/posters/w342',
      tmdb: 'https://image.tmdb.org/t/p/w342',
    },
  },
  backdrop: {
    w300: 'https://image.tmdb.org/t/p/w300',
    w780: 'https://image.tmdb.org/t/p/w780',
    w1280: 'https://image.tmdb.org/t/p/w1280',
  },
} as const;
