/**
 * @description Parses the arbitrary AI model response content into a structured format
 * @param content - The content returned from the AI model
 * @returns An array of movie objects with title, release year, and why
 */
export const parseMoviesFromOutputStream = (content: string) => {
  const parsed: { tmdbId: number; title: string; releaseYear: string; why: string }[] = [];

  const titleRegex = /"title":\s*"([^"]+)"?/g;
  const releaseYearRegex1 = /"release_year":\s*"([^"]+)/g;
  const releaseYearRegex2 = /"release_year":\s*(\d+)/g;
  const whyRegex = /"why":\s*"([^"]+)"?/g;

  const titleMatches = content.matchAll(titleRegex);
  const releaseYearMatches = [...content.matchAll(releaseYearRegex1), ...content.matchAll(releaseYearRegex2)];
  const whyMatches = content.matchAll(whyRegex);

  [...titleMatches].forEach((match, index) => {
    const title = match[1].trim();

    if (!parsed[index]) {
      parsed[index] = { tmdbId: 0, title, releaseYear: '', why: '' };
    } else {
      parsed[index].title = title;
    }
  });

  [...releaseYearMatches].forEach((match, index) => {
    const releaseYear = match[1].trim();

    if (!parsed[index]) {
      parsed[index] = { tmdbId: 0, title: '', releaseYear, why: '' };
    } else {
      parsed[index].releaseYear = releaseYear;
    }
  });

  [...whyMatches].forEach((match, index) => {
    const why = match[1].trim();

    if (!parsed[index]) {
      parsed[index] = { tmdbId: 0, title: '', releaseYear: '', why };
    } else {
      parsed[index].why = why;
    }
  });

  return parsed;
};
