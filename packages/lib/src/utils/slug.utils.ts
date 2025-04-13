import slugify from 'slugify';

export const createUrlSlug = (string: string, year?: string) => {
  return slugify(string.toLowerCase());
};
