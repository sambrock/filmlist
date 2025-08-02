import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

import { type Message } from '@/lib/drizzle';

export const stream = async (model: string, messages: Message[]) => {
  return streamText({
    model: openai('gpt-4.1-nano'),
    messages: [
      {
        role: 'system',
        content: `
          You are a movie recommendation AI.

          Suggest exactly **4 existing movies** based on conversations. 

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
      },
      ...messages.map((message) => ({ role: message.role, content: message.content })),
    ],
  });
};
