// import { openai } from './api';

import { openai } from './api';

export const getModelCompletion = async (message: string) => {
  const response = await openai.chat.completions.create({
    // model: 'meta-llama/llama-3.3-8b-instruct:free',
    // model: 'deepseek/deepseek-r1-0528:free',
    model: 'microsoft/mai-ds-r1:free',
    messages: [
      {
        role: 'user',
        content: `You are a movie recommendation AI. Suggest 5 movies that are "${message}". For each movie title and release year. Format the output as a JSON array of objects with 'title' and 'release_year' keys. Only suggest existing movies.`,
      },
    ],
  });

  if (!response.choices || response.choices.length === 0) {
    throw new Error('No choices returned from OpenAI API');
  }

  const content = response.choices[0].message.content;

  return content;
};
