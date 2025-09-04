import { openai } from '@ai-sdk/openai';

export type Model = 'openai/gpt-4.1-nano' | 'openai/gpt-4.1' | 'openai/gpt-4' | 'xai/grok-3-beta';

export const models = new Map([
  [
    'openai/gpt-4.1-nano',
    {
      id: 'openai/gpt-4.1-nano',
      name: 'GPT-4.1 Nano',
      provider: 'OpenAI',
      description: 'A smaller, faster version of GPT-4.1',
      active: true,
    },
  ],
  [
    'openai/gpt-4.1',
    {
      id: 'openai/gpt-4.1',
      name: 'GPT-4.1',
      provider: 'OpenAI',
      description: 'The latest version of GPT-4',
      active: true,
    },
  ],
  [
    'openai/gpt-4',
    {
      id: 'openai/gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'The original GPT-4 model',
      active: true,
    },
  ],
  [
    'xai/grok-3-beta',
    {
      id: 'xai/grok-3-beta',
      name: 'Grok 3 Beta',
      provider: 'XAI',
      description: 'The beta version of Grok 3',
      active: true,
    },
  ],
] as const) satisfies ReadonlyMap<
  Model,
  {
    id: string;
    name: string;
    provider: string;
    description: string;
    active: boolean;
  }
>;

export const getModel = (model: Model) => {
  const [provider, modelId] = model.split('/');

  switch (provider) {
    case 'openai': {
      return openai(modelId);
    }
    default: {
      return openai('gpt-4.1-nano');
    }
  }
};
