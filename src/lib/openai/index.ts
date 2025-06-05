import OpenAI from 'openai';

import { env } from '../utils/env';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://filmlist.app',
    'X-Title': 'FILMLIST',
  },
});

export const createCompletion = async (message: string) => {
  const response = await openai.chat.completions.create({
    model: 'microsoft/mai-ds-r1:free',
    messages: [
      {
        role: 'user',
        content: `You are a movie recommendation AI. Suggest 5 movies that are "${message}". For each movie title and release year. Format the output as a JSON array of objects with 'title' and 'release_year' keys. Only suggest existing movies.`,
      },
    ],
  });

  const data = response.choices[0].message.content;

  if (!response.choices || response.choices.length === 0 || !data) {
    return { success: false, data: '', error: 'No response from model' };
  }

  return { success: true, data };
};

// model: 'meta-llama/llama-3.3-8b-instruct:free',
// model: 'deepseek/deepseek-r1-0528:free',
