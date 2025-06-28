export const baseMessage = (content: string) => {
  return `
    You are a movie recommendation AI. 
    Suggest 5 movies that are "${content}". 
    For each movie title and release year. 
    Format the output as a JSON array of objects with 'title' and 'release_year' keys. 
    Only suggest existing movies.
  `.trim();
};

export const parseMoviesFromMessage = (
  message: string,
  foundMoviesMap: Map<number, { title: string; releaseYear: string }>
) => {
  const regex1 = /"title":\s*"([^"]+)",\s*"release_year":\s*(\d{4})/g;

  const matches = [...message.matchAll(regex1)];

  for (const match of matches) {
    const index = matches.indexOf(match);
    const [, title, releaseYear] = match;

    foundMoviesMap.set(index, {
      title: title.trim(),
      releaseYear: releaseYear.trim(),
    });
  }
};
