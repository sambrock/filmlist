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

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  });
  console.log(completion.choices[0].message);
}

main();
