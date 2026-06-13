/**
 * AI Provider 预设配置
 */

export interface ProviderPreset {
  name: string;
  label: string;
  baseURL: string;
  defaultModel: string;
  models: string[];
  description?: string;
}

export const PROVIDER_PRESETS: Record<string, ProviderPreset> = {
  openai: {
    name: 'openai',
    label: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    description: '官方 OpenAI API',
  },
  deepseek: {
    name: 'deepseek',
    label: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-coder'],
    description: 'DeepSeek AI',
  },
  qwen: {
    name: 'qwen',
    label: '通义千问',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
    description: '阿里云通义千问',
  },
  moonshot: {
    name: 'moonshot',
    label: 'Moonshot',
    baseURL: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-8k',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    description: '月之暗面 Kimi',
  },
  ollama: {
    name: 'ollama',
    label: 'Ollama (本地)',
    baseURL: 'http://localhost:11434/v1',
    defaultModel: 'llama3',
    models: ['llama3', 'qwen2', 'mistral'],
    description: '本地 Ollama 服务',
  },
  custom: {
    name: 'custom',
    label: '自定义',
    baseURL: '',
    defaultModel: '',
    models: [],
    description: '自定义 OpenAI 兼容 API',
  },
} as const;

export type ProviderName = keyof typeof PROVIDER_PRESETS;

export function getProvider(name: string): ProviderPreset | undefined {
  return PROVIDER_PRESETS[name];
}

export function getProviderNames(): string[] {
  return Object.keys(PROVIDER_PRESETS);
}
