export const baseMessage = (content: string) => {
  return `
    You are a movie recommendation AI. 
    Suggest 5 movies that are "${content}". 
    For each movie title and release year. 
    Format the output as a JSON array of objects with 'title' and 'release_year' keys. 
    Only suggest existing movies.
  `.trim();
};

export const findMoviesFromCompletionString = (completion: string) => {
  const movieRegex = /"title":\s*"([^"]+)",\s*"release_year":\s*(\d{4})/g;
  const movies: { title: string; release_year: number }[] = [];
  let match;

  while ((match = movieRegex.exec(completion)) !== null) {
    const title = match[1];
    const releaseYear = parseInt(match[2], 10);
    movies.push({ title, release_year: releaseYear });
  }

  return movies;
};
