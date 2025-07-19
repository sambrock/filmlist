import { cx, type CxOptions } from 'class-variance-authority';
import { v4 } from 'uuid';

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const cn = (...inputs: CxOptions) => {
  return cx(inputs);
};

export const generateUuid = () => {
  return v4();
};

export const scrollToEnd = () => {
  const end = document.getElementById('chat-end');
  if (end) {
    end.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'end' });
  }
};

export const posterSrc = (
  posterPath: string,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'
) => {
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

export const backdropSrc = (backdropPath: string, size: 'w300' | 'w780' | 'w1280' | 'original') => {
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
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
