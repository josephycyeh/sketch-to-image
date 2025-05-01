export const MODEL_OPTIONS = [
  { label: 'Gemini 2.0 Flash', value: 'gemini' },
  { label: 'GPT-4o', value: 'openai' },
] as const;

export type ModelType = typeof MODEL_OPTIONS[number]['value']; 