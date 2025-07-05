export const baseMessage = (content: string) => {
  return `
    You are a movie recommendation AI. 
    Suggest 5 movies that are "${content}". 
    For each movie title and release year. 
    Format the output as a JSON array of objects with 'title' and 'release_year' keys. 
    Only suggest existing movies.
  `.trim();
};
