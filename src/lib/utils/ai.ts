import { type ModelMessage } from 'ai';

import { ModelResponseStructured } from '../drizzle/types';

export const SYSTEM_CONTEXT_MESSAGE: ModelMessage = {
  role: 'system',
  content: `
    You are a movie recommendation AI.

    Suggest exactly **4 existing movies** based on conversations.
    Do not suggest TV series. Just existing movies.

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
  `,
} as const;

/**
 * @description Parses the arbitrary AI model response content into a structured format
 * @param content - The content returned from the AI model
 * @returns An array of movie objects with title, release year, and why
 */
export const modelResponseToStructured = (content: string) => {
  const parsed: ModelResponseStructured[] = [];

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

export const readEventStream = async (response: Response, onData: (data: string) => void) => {
  const decoder = new TextDecoder();
  const reader = response.body!.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.trim() === '' || line.startsWith(':') || line.startsWith('event:')) {
        continue;
      }

      const data = line.replace(/^data:\s*/, '').trim();
      onData(data);
    }
  }
};
