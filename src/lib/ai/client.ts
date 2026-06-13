export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  apiKey: string;
  baseURL: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  signal?: AbortSignal;
}

export class AiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AiError';
    this.status = status;
  }
}

// 通过本地 Next.js Route Handler 代理转发，解决浏览器 CORS
const PROXY_URL = '/api/ai/chat';

async function readError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data?.error?.message) return data.error.message;
    return JSON.stringify(data);
  } catch {
    try {
      return await res.text();
    } catch {
      return res.statusText;
    }
  }
}

function basePayload(opts: ChatOptions, stream: boolean) {
  return {
    apiKey: opts.apiKey,
    baseURL: opts.baseURL,
    model: opts.model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.4,
    stream,
  };
}

export async function chatCompletion(opts: ChatOptions): Promise<string> {
  if (!opts.apiKey) throw new AiError('未配置 API Key');
  let res: Response;
  try {
    res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basePayload(opts, false)),
      signal: opts.signal,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new AiError(`无法连接到本地代理：${msg}`);
  }
  if (!res.ok) {
    const msg = await readError(res);
    throw new AiError(`AI 请求失败：${msg}`, res.status);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') throw new AiError('AI 返回内容为空');
  return content;
}

export async function* chatCompletionStream(opts: ChatOptions): AsyncGenerator<string, void, unknown> {
  if (!opts.apiKey) throw new AiError('未配置 API Key');
  let res: Response;
  try {
    res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basePayload(opts, true)),
      signal: opts.signal,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new AiError(`无法连接到本地代理：${msg}`);
  }
  if (!res.ok) {
    const msg = await readError(res);
    throw new AiError(`AI 请求失败：${msg}`, res.status);
  }
  if (!res.body) throw new AiError('AI 响应缺少 body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const rawLine = buffer.slice(0, idx).replace(/\r$/, '');
        buffer = buffer.slice(idx + 1);
        if (!rawLine) continue;
        if (!rawLine.startsWith('data:')) continue;
        const data = rawLine.slice(5).trim();
        if (!data) continue;
        if (data === '[DONE]') return;
        try {
          const json = JSON.parse(data);
          const delta = json?.choices?.[0]?.delta?.content;
          if (typeof delta === 'string' && delta.length) yield delta;
        } catch {
          // 忽略无法解析的行（部分上游会发心跳行）
        }
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* noop */
    }
  }
}
