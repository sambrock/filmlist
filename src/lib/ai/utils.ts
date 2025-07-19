/**
 *
 * @param content - The content to base the recommendations on
 * @description Generates a base message for the AI model to understand the context of the recommendations
 * @returns A formatted string to be used as the base message for the AI model
 */
export const baseMessage = (content: string) => `
You are a movie recommendation AI.

Suggest exactly **4 existing movies** that match this description: "${content}"

Return the result as a **JSON array of 4 objects**.  
Each object must have the following keys:

- **title**: string  
- **release_year**: number (e.g., 2010)  
- **why**: string (explain briefly why you recommend it)  

Example output:

[
  {
    "title": "Inception",
    "release_year": 2010,
    "why": "A mind-bending thriller with emotional depth."
  }
]
`;

/**
 * @description Parses the arbitrary AI model response content into a structured format
 * @param content - The content returned from the AI model
 * @returns An array of movie objects with title, release year, and why
 */
export const parseRecommendationsFromResponse = (content: string) => {
  const parsed: { title: string; releaseYear: string; why: string }[] = [];

  const titleRegex = /"title":\s*"([^"]+)"?/g;
  const releaseYearRegex = /"release_year":\s*"([^"]+)/g;
  const whyRegex = /"why":\s*"([^"]+)"?/g;

  const titleMatches = content.matchAll(titleRegex);
  const releaseYearMatches = content.matchAll(releaseYearRegex);
  const whyMatches = content.matchAll(whyRegex);

  [...titleMatches].forEach((match, index) => {
    const title = match[1].trim();

    if (!parsed[index]) {
      parsed[index] = { title, releaseYear: '', why: '' };
    } else {
      parsed[index].title = title;
    }
  });

  [...releaseYearMatches].forEach((match, index) => {
    const releaseYear = match[1].trim();

    if (!parsed[index]) {
      parsed[index] = { title: '', releaseYear, why: '' };
    } else {
      parsed[index].releaseYear = releaseYear;
    }
  });

  [...whyMatches].forEach((match, index) => {
    const why = match[1].trim();

    if (!parsed[index]) {
      parsed[index] = { title: '', releaseYear: '', why };
    } else {
      parsed[index].why = why;
    }
  });

  return parsed;
};
