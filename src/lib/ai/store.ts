import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PROVIDER_PRESETS, type ProviderName } from './providers';

export interface AiSettings {
  provider: ProviderName;
  apiKey: string;
  baseURL: string;
  model: string;
  setProvider: (name: ProviderName) => void;
  setApiKey: (v: string) => void;
  setBaseURL: (v: string) => void;
  setModel: (v: string) => void;
  reset: () => void;
}

const DEFAULT_PROVIDER: ProviderName = 'openai';

export function getDefaultSettings(provider: ProviderName = DEFAULT_PROVIDER) {
  const preset = PROVIDER_PRESETS[provider];
  return {
    provider,
    baseURL: preset.baseURL,
    model: preset.defaultModel,
  };
}

export const DEFAULT_BASE_URL = PROVIDER_PRESETS[DEFAULT_PROVIDER].baseURL;
export const DEFAULT_MODEL = PROVIDER_PRESETS[DEFAULT_PROVIDER].defaultModel;

// 使用 XOR 加密混淆 apiKey（比 Base64 更安全，但仍是对称的）
// 注意：这不是真正的加密，只是防止 casual 窃取
const XOR_KEY = 'spec-driven-2024';

function xorEncode(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length)
    );
  }
  return typeof btoa === 'function' ? btoa(result) : result;
}

function xorDecode(encoded: string): string {
  try {
    const decoded = typeof atob === 'function' ? atob(encoded) : encoded;
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length)
      );
    }
    return result;
  } catch {
    return encoded; // 兼容未编码的旧数据
  }
}

export const useAiSettings = create<AiSettings>()(
  persist(
    (set) => ({
      provider: DEFAULT_PROVIDER,
      apiKey: '',
      baseURL: DEFAULT_BASE_URL,
      model: DEFAULT_MODEL,

      setProvider: (name: ProviderName) => {
        const preset = PROVIDER_PRESETS[name];
        // 切换 provider 时清除 apiKey 并更新配置
        set({
          provider: name,
          apiKey: '',
          baseURL: preset.baseURL,
          model: preset.defaultModel,
        });
      },

      setApiKey: (v) => set({ apiKey: v.trim() }),
      setBaseURL: (v) => set({ baseURL: v.trim() }),
      setModel: (v) => set({ model: v.trim() }),

      reset: () =>
        set({
          ...getDefaultSettings(DEFAULT_PROVIDER),
          apiKey: '',
        }),
    }),
    {
      name: 'spec-driven-ai-settings',
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          try {
            const parsed = JSON.parse(raw);
            // 读取时解密 apiKey
            if (parsed?.state?.apiKey) {
              parsed.state.apiKey = xorDecode(parsed.state.apiKey);
            }
            // 兼容旧配置：如果没有 provider 字段，根据 baseURL 推断
            if (!parsed?.state?.provider) {
              const baseURL = parsed?.state?.baseURL || '';
              const matchedProvider = Object.entries(PROVIDER_PRESETS).find(
                ([_, p]) => p.baseURL === baseURL
              );
              parsed.state.provider = matchedProvider ? matchedProvider[0] : 'custom';
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          // 存储时加密 apiKey
          const toStore = JSON.parse(JSON.stringify(value));
          if (toStore?.state?.apiKey) {
            toStore.state.apiKey = xorEncode(toStore.state.apiKey);
          }
          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
