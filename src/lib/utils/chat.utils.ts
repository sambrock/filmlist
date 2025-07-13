import { marked } from 'marked';

import type { Message, Movie } from '../drizzle/zod';

export type ChatEventStreamData =
  | { type: 'content'; v: string }
  | { type: 'movie'; v: Movie; i: number }
  | { type: 'message'; v: Message }
  | { type: 'end' };

export const chatEventStreamData = (payload: ChatEventStreamData) => {
  return payload;
};

/**
 * @description Reads the chat event stream response and calls the provided callback with each data chunk
 * @param response The response from the chat API stream
 * @param onData Callback function to handle each data chunk
 */
export const readChatEventStream = async (response: Response, onData: (data: string) => void) => {
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

/**
 * @description Parses the arbitrary AI model response content into a structured format
 * @param content - The content returned from the AI model
 * @returns
 */
export const parseMessageContentToMovies = (content: string) => {
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

/**
 * @description Converts markdown content to HTML
 * @param content - The markdown content to convert
 * @returns The converted HTML string
 */
export const convertMarkdownContentToHtml = (content: string): string => {
  return marked(content) as string;
};
