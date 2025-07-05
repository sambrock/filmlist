import OpenAI from 'openai';

import { OPENAI_BASE_URL, OPENAI_HTTP_REFERER, OPENAI_TITLE } from '../constants';
import { env } from '../env';

export const openai = new OpenAI({
  baseURL: OPENAI_BASE_URL,
  apiKey: env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': OPENAI_HTTP_REFERER,
    'X-Title': OPENAI_TITLE,
  },
});
