'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { buildAgentsRewritePrompt } from '@/lib/ai/prompts';
import { AIPanel } from '@/components/ai/AIPanel';
import { MarkdownView } from '@/components/markdown/MarkdownView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function AgentsPreviewPage() {
  const router = useRouter();
  const { agentContent, setAgentContent, productSpec, _hasHydrated } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(agentContent || '');
  const [showAI, setShowAI] = useState(false);

  if (!_hasHydrated) {
    return (
      <div className="container py-10 text-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!agentContent || !productSpec) {
    return (
      <div className="container py-10 text-center">
        <p className="text-muted-foreground mb-4">尚未生成 AGENTS.md，请先完成向导</p>
        <Button onClick={() => router.push('/wizard')}>前往向导</Button>
      </div>
    );
  }

  const handleSave = () => {
    setAgentContent(editContent);
    setIsEditing(false);
  };

  return (
    <div className="container py-10 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">🤖 AGENTS.md</CardTitle>
              <CardDescription>{productSpec.name} 的 AI 工具配置文档</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAI(!showAI)}>
                {showAI ? '隐藏 AI' : '✨ AI 增强'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setIsEditing(!isEditing); setEditContent(agentContent); }}>
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
                title="AI 完善 AGENTS.md"
                triggerLabel="让 AI 完善"
                buildMessages={() => buildAgentsRewritePrompt(productSpec, agentContent)}
                display="plain"
                onApply={(content) => { setAgentContent(content); setEditContent(content); setShowAI(false); }}
                applyLabel="采纳 AI 版本"
                helperText="AI 将补全硬性约束、代码风格和项目结构"
              />
            </div>
          )}
          {isEditing ? (
            <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[500px] font-mono text-sm" />
          ) : (
            <div className="rounded-lg border bg-card p-6"><MarkdownView content={agentContent} /></div>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => router.push('/preview/phases')}>← Phase 计划</Button>
        <Button onClick={() => router.push('/export')}>前往导出 →</Button>
      </div>
    </div>
  );
}
