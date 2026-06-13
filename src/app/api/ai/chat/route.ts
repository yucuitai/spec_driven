import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
// 不要缓存
export const dynamic = 'force-dynamic';

interface ProxyBody {
  apiKey: string;
  baseURL: string;
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  stream?: boolean;
}

function buildUrl(baseURL: string): string {
  const trimmed = baseURL.replace(/\/$/, '');
  if (trimmed.endsWith('/chat/completions')) return trimmed;
  return `${trimmed}/chat/completions`;
}

export async function POST(req: NextRequest) {
  let body: ProxyBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: { message: '请求体不是合法 JSON' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { apiKey, baseURL, model, messages, temperature, stream } = body;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: '缺少 apiKey' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!baseURL) {
    return new Response(JSON.stringify({ error: { message: '缺少 baseURL' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: { message: 'messages 不能为空' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const upstream = await fetch(buildUrl(baseURL), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: temperature ?? 0.4,
      stream: Boolean(stream),
    }),
    signal: req.signal,
  }).catch((e: unknown) => {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: { message: `上游请求失败：${msg}` } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  // 失败响应直接转发
  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    return new Response(text || JSON.stringify({ error: { message: upstream.statusText } }), {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
    });
  }

  // 流式：把上游 body 原样转发出去（保持 SSE）
  if (stream && upstream.body) {
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  }

  // 非流式：直接转发 JSON
  const text = await upstream.text();
  return new Response(text, {
    status: 200,
    headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
  });
}
