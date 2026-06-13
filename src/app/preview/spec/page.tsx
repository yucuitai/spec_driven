'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { buildSpecRewritePrompt } from '@/lib/ai/prompts';
import { AIPanel } from '@/components/ai/AIPanel';
import { MarkdownView } from '@/components/markdown/MarkdownView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function SpecPreviewPage() {
  const router = useRouter();
  const { specContent, setSpecContent, productSpec, _hasHydrated } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(specContent || '');
  const [showAI, setShowAI] = useState(false);

  if (!_hasHydrated) {
    return (
      <div className="container py-10 text-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!specContent || !productSpec) {
    return (
      <div className="container py-10 text-center">
        <p className="text-muted-foreground mb-4">尚未生成 Spec 文档，请先完成向导</p>
        <Button onClick={() => router.push('/wizard')}>前往向导</Button>
      </div>
    );
  }

  const handleSave = () => {
    setSpecContent(editContent);
    setIsEditing(false);
  };

  return (
    <div className="container py-10 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">📋 Spec 文档</CardTitle>
              <CardDescription>{productSpec.name} 的产品规格文档</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAI(!showAI)}>
                {showAI ? '隐藏 AI' : '✨ AI 增强'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setIsEditing(!isEditing); setEditContent(specContent); }}>
                {isEditing ? '取消' : '✏️ 编辑'}
              </Button>
              {isEditing && <Button size="sm" onClick={handleSave}>保存</Button>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showAI && (
            <div className="mb-6">
              <AIPanel
                title="AI 完善 Spec"
                triggerLabel="让 AI 完善这份 Spec"
                buildMessages={() => buildSpecRewritePrompt(productSpec, specContent)}
                display="plain"
                onApply={(content) => { setSpecContent(content); setEditContent(content); setShowAI(false); }}
                applyLabel="采纳 AI 版本"
                helperText="AI 将基于你的产品信息重写并完善 Spec 文档"
              />
            </div>
          )}
          {isEditing ? (
            <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[500px] font-mono text-sm" />
          ) : (
            <div className="rounded-lg border bg-card p-6"><MarkdownView content={specContent} /></div>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => router.push('/wizard')}>← 返回向导</Button>
        <Button onClick={() => router.push('/preview/phases')}>查看 Phase 计划 →</Button>
      </div>
    </div>
  );
}
