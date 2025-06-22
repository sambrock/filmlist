export type ModelKey = keyof typeof models;

export const models = new Map([
  [
    'deepseek/deepseek-chat-v3-0324:free',
    {
      model: 'deepseek/deepseek-chat-v3-0324:free',
      label: 'DeepSeek Chat V3',
      provider: 'DeepSeek',
      free: true,
    },
  ],
  [
    'deepseek/deepseek-r1-0528:free',
    {
      model: 'deepseek/deepseek-r1-0528:free',
      label: 'DeepSeek R1',
      provider: 'DeepSeek',
      free: true,
    },
  ],
  [
    'meta-llama/llama-3.3-8b-instruct:free',
    {
      model: 'meta-llama/llama-3.3-8b-instruct:free',
      label: 'Llama 3.3',
      provider: 'Meta',
      free: true,
    },
  ],
  [
    'meta-llama/llama-4-maverick:free',
    {
      model: 'meta-llama/llama-4-maverick:free',
      label: 'LLlama 4 Maverick',
      provider: 'Meta',
      free: true,
    },
  ],
  [
    'meta-llama/llama-4-scout:free',
    {
      model: 'meta-llama/llama-4-scout:free',
      label: 'Llama 4 Scout',
      provider: 'Meta',
      free: true,
    },
  ],
  [
    'microsoft/mai-ds-r1:free',
    {
      model: 'microsoft/mai-ds-r1:free',
      label: 'MAI DS R1',
      provider: 'Microsoft',
      free: true,
    },
  ],
  // [
  //   'deepseek/deepseek-r1:free',
  //   {
  //     model: 'deepseek/deepseek-r1:free',
  //     label: 'DeepSeek R1',
  //     provider: 'DeepSeek',
  //     active: false,
  //     free: true,
  //   },
  // ],
]) satisfies Map<
  string,
  {
    model: string;
    label: string;
    provider: string;
    free: boolean;
  }
>;

export const supportedModelsEnum = [...models.keys()] as [string, ...string[]];
