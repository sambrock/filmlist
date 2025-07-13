export const baseMessage = (content: string) => {
  return `
    You are a movie recommendation AI. 
    Suggest 4 movies that are "${content}". 
    For each movie title, release_year and why. ({title: string, release_year: string, why: string}) 
    Format the output as a JSON array of objects with 'title' and 'release_year' keys. 
    Only suggest existing movies.
  `;
};
