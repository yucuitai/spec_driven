'use client';

import { useState, useEffect } from 'react';
import { useAiSettings, DEFAULT_BASE_URL, DEFAULT_MODEL } from '@/lib/ai/store';
import { chatCompletion } from '@/lib/ai/client';
import { PROVIDER_PRESETS, type ProviderName, getProviderNames } from '@/lib/ai/providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, AlertTriangle, Loader2, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { provider, apiKey, baseURL, model, setProvider, setApiKey, setBaseURL, setModel, reset } = useAiSettings();
  const [draftProvider, setDraftProvider] = useState<ProviderName>(provider);
  const [draftKey, setDraftKey] = useState(apiKey);
  const [draftBase, setDraftBase] = useState(baseURL);
  const [draftModel, setDraftModel] = useState(model);
  const [status, setStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');
  const [statusMsg, setStatusMsg] = useState<string>('');

  // 当 provider 变化时更新 draft
  useEffect(() => {
    const preset = PROVIDER_PRESETS[draftProvider];
    if (preset && draftProvider !== 'custom') {
      setDraftBase(preset.baseURL);
      setDraftModel(preset.defaultModel);
    }
  }, [draftProvider]);

  const save = () => {
    setProvider(draftProvider);
    setApiKey(draftKey);
    setBaseURL(draftBase);
    setModel(draftModel);
    setStatus('idle');
    setStatusMsg('');
  };

  const test = async () => {
    save();
    setStatus('testing');
    setStatusMsg('');
    try {
      const res = await chatCompletion({
        apiKey: draftKey,
        baseURL: draftBase || DEFAULT_BASE_URL,
        model: draftModel || DEFAULT_MODEL,
        messages: [
          { role: 'system', content: '只回复中文，且尽量简短' },
          { role: 'user', content: '请回复"连接成功"四个字' },
        ],
        temperature: 0,
      });
      setStatus('ok');
      setStatusMsg(res.slice(0, 60));
    } catch (e) {
      setStatus('fail');
      const err = e as { message?: string };
      setStatusMsg(err?.message || String(e));
    }
  };

  const clear = () => {
    if (!confirm('确定清除已保存的 API Key 与配置？')) return;
    reset();
    setDraftProvider('openai');
    setDraftKey('');
    setDraftBase(DEFAULT_BASE_URL);
    setDraftModel(DEFAULT_MODEL);
    setStatus('idle');
    setStatusMsg('');
  };

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-2">AI 配置</h1>
      <p className="text-muted-foreground mb-8">
        填写 OpenAI 兼容 API（OpenAI / DeepSeek / 通义 / Moonshot / Together / Ollama 等）。
        <br />
        <span className="text-xs">所有信息仅保存在浏览器本地（localStorage），不会上传任何服务器。</span>
      </p>

      <Card>
        <CardHeader>
          <CardTitle>OpenAI 兼容协议</CardTitle>
          <CardDescription>未填写也能正常使用模板生成；配置后即可使用 AI 增强</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">AI 服务商</label>
            <Select
              value={draftProvider}
              onValueChange={(v) => setDraftProvider(v as ProviderName)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="选择 AI 服务商" />
              </SelectTrigger>
              <SelectContent>
                {getProviderNames().map((name) => {
                  const preset = PROVIDER_PRESETS[name];
                  return (
                    <SelectItem key={name} value={name}>
                      {preset.label}
                      {preset.description && (
                        <span className="text-muted-foreground ml-2">({preset.description})</span>
                      )}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">API Key</label>
            <Input
              type="password"
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder="sk-..."
              className="mt-1 font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Base URL</label>
            <Input
              value={draftBase}
              onChange={(e) => setDraftBase(e.target.value)}
              placeholder={DEFAULT_BASE_URL}
              className="mt-1 font-mono"
              disabled={draftProvider !== 'custom'}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {draftProvider === 'custom'
                ? '不带 /chat/completions；如 https://api.deepseek.com/v1'
                : `当前服务商：${PROVIDER_PRESETS[draftProvider]?.label}`}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Model</label>
            {draftProvider !== 'custom' && PROVIDER_PRESETS[draftProvider]?.models.length > 0 ? (
              <Select
                value={draftModel}
                onValueChange={(v) => setDraftModel(v ?? '')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_PRESETS[draftProvider].models.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={draftModel}
                onChange={(e) => setDraftModel(e.target.value)}
                placeholder={DEFAULT_MODEL}
                className="mt-1 font-mono"
              />
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {draftProvider === 'custom'
                ? '如 gpt-4o-mini / deepseek-chat / qwen-plus'
                : `默认：${PROVIDER_PRESETS[draftProvider]?.defaultModel}`}
            </p>
          </div>

          {status === 'ok' && (
            <div className="flex items-start gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <span>连接成功：{statusMsg}</span>
            </div>
          )}
          {status === 'fail' && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="break-all">连接失败：{statusMsg}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button onClick={test} disabled={!draftKey || status === 'testing'}>
              {status === 'testing' ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 测试中</>) : '测试连接并保存'}
            </Button>
            <Button variant="outline" onClick={save}>仅保存</Button>
            {apiKey && (
              <Button variant="ghost" onClick={clear} className="ml-auto text-destructive">
                <Trash2 className="h-4 w-4 mr-1" /> 清除
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
