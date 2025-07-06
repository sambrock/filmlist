import { marked } from 'marked';

import { Message, Movie } from '../drizzle/zod';

export type ChatEventStreamData =
  | { type: 'content'; v: string }
  | { type: 'movie'; v: Movie }
  | { type: 'message'; v: Message }
  | { type: 'end' };

export const chatEventStreamData = (payload: ChatEventStreamData) => {
  return payload;
};

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

export const findMoviesInContent = (
  content: string,
  foundMoviesMap: Map<number, { title: string; releaseYear: string }>
) => {
  const regex1 = /"title":\s*"([^"]+)",\s*"release_year":\s*(\d{4})/g;

  const matches = [...content.matchAll(regex1)];

  for (const match of matches) {
    const index = matches.indexOf(match);
    const [, title, releaseYear] = match;

    foundMoviesMap.set(index, {
      title: title.trim(),
      releaseYear: releaseYear.trim(),
    });
  }
};

export const convertMarkdownContentToHtml = (content: string): string => {
  return marked(content) as string;
};

export const formatContent = (content: string): ({ type: 'TEXT'; html: string } | { type: 'MOVIES' })[] => {
  const jsonCodeRegex = /\`\`\`(?:\w+\n)?([\s\S]*?)\`\`\`/g;
  const partialJsonCodeRegex = /\`\`\`(.*)/g;

  if (content.match(jsonCodeRegex)) {
    const parts = content.split(jsonCodeRegex);
    return parts.map((part) => {
      if (part.trim() === '') return { type: 'TEXT', html: '' };
      if (part.startsWith('json') || part.startsWith('`') || part.includes('[')) {
        return { type: 'MOVIES' };
      }
      return { type: 'TEXT', html: convertMarkdownContentToHtml(part) };
    });
  } else if (content.match(partialJsonCodeRegex)) {
    const parts = content.split(partialJsonCodeRegex);
    return parts.map((part) => {
      if (part.trim() === '') return { type: 'TEXT', html: '' };
      if (part.startsWith('json') || part.startsWith('`') || part.startsWith('[')) {
        return { type: 'MOVIES' };
      }
      return { type: 'TEXT', html: convertMarkdownContentToHtml(part) };
    });
  } else {
    return [{ type: 'TEXT', html: convertMarkdownContentToHtml(content) }];
  }
};
