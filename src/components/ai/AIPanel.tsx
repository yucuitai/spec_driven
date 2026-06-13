'use client';

import { useEffect, useRef, useState } from 'react';
import { useAiSettings } from '@/lib/ai/store';
import { chatCompletionStream, type ChatMessage } from '@/lib/ai/client';
import { Button } from '@/components/ui/button';
import { MarkdownView } from '@/components/markdown/MarkdownView';
import { Loader2, Square, Sparkles, AlertTriangle, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export interface AIPanelProps {
  title?: string;
  buildMessages: () => ChatMessage[];
  triggerLabel?: string;
  autoRun?: boolean;
  onApply?: (content: string) => void;
  applyLabel?: string;
  // 渲染模式：富文本（Markdown）或纯文本（用于 spec/phases 这类需要原样替换的）
  display?: 'markdown' | 'plain';
  helperText?: string;
}

export function AIPanel({
  title = 'AI 助手',
  buildMessages,
  triggerLabel = '让 AI 给建议',
  autoRun = false,
  onApply,
  applyLabel = '采纳到当前内容',
  display = 'markdown',
  helperText,
}: AIPanelProps) {
  const { apiKey, baseURL, model } = useAiSettings();
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hasKey = Boolean(apiKey);

  const run = async () => {
    if (!hasKey) return;
    setError(null);
    setOutput('');
    setRunning(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const messages = buildMessages();
      let acc = '';
      const stream = chatCompletionStream({ apiKey, baseURL, model, messages, signal: ctrl.signal });
      for await (const delta of stream) {
        acc += delta;
        setOutput(acc);
      }
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string };
      if (err?.name !== 'AbortError') setError(err?.message || String(e));
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  useEffect(() => {
    if (autoRun && hasKey) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>{title}</span>
        </div>
        <div className="flex gap-2">
          {running ? (
            <Button size="sm" variant="outline" onClick={stop}>
              <Square className="h-3.5 w-3.5 mr-1" /> 停止
            </Button>
          ) : (
            <Button size="sm" onClick={run} disabled={!hasKey}>
              {output ? (<><RotateCcw className="h-3.5 w-3.5 mr-1" /> 重新生成</>) : triggerLabel}
            </Button>
          )}
        </div>
      </div>

      {!hasKey && (
        <div className="text-xs text-muted-foreground">
          未配置 API Key。 <Link href="/settings" className="underline">前往设置</Link>
        </div>
      )}

      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="break-all">{error}</span>
        </div>
      )}

      {(running || output) && (
        <div className="rounded-md bg-background border p-3 text-sm max-h-[60vh] overflow-auto">
          {output ? (
            display === 'markdown' ? <MarkdownView content={output} /> : <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{output}</pre>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> 正在生成...</div>
          )}
        </div>
      )}

      {output && !running && onApply && (
        <div className="flex justify-end">
          <Button size="sm" variant="default" onClick={() => onApply(output)}>
            {applyLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
