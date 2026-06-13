'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const router = useRouter();
  const { productSpec, specContent, phasesContent, agentContent, _hasHydrated } = useAppStore();

  if (!_hasHydrated) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!productSpec || !specContent || !phasesContent || !agentContent) {
    return (
      <div className="container py-20 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h2 className="text-xl font-semibold mb-2">尚未生成文档</h2>
        <p className="text-muted-foreground mb-6">请先完成向导，生成文档后再来导出</p>
        <Button onClick={() => router.push('/wizard')}>前往向导</Button>
      </div>
    );
  }

  const handleDownloadAll = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    zip.file('spec.md', specContent);
    zip.file('phases.md', phasesContent);
    zip.file('AGENTS.md', agentContent);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productSpec.name}-docs.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const documents = [
    { name: 'Spec 文档', filename: 'spec.md', content: specContent, icon: '📋', desc: '产品规格、功能列表、数据模型' },
    { name: 'Phase 计划', filename: 'phases.md', content: phasesContent, icon: '🎯', desc: '开发阶段、验收标准、交付物' },
    { name: 'AGENTS.md', filename: 'AGENTS.md', content: agentContent, icon: '🤖', desc: 'AI 工具配置、项目约束、命令' },
  ];

  return (
    <div className="container py-10 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">📦 导出文档</h1>
        <p className="text-muted-foreground">{productSpec.name} — 预览并下载生成的文档</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {documents.map((doc) => (
          <Card key={doc.filename} className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">{doc.icon}</span>
                {doc.name}
              </CardTitle>
              <CardDescription className="text-xs">{doc.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 rounded-md bg-muted/50 p-3 mb-4 overflow-hidden" style={{ maxHeight: 160 }}>
                <pre className="whitespace-pre-wrap text-xs text-muted-foreground leading-relaxed">
                  {doc.content.slice(0, 300)}{doc.content.length > 300 ? '...' : ''}
                </pre>
              </div>
              <Button variant="outline" className="w-full" onClick={() => downloadFile(doc.filename, doc.content)}>
                下载 {doc.filename}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button size="lg" onClick={handleDownloadAll} className="h-12 px-10">
          📦 打包下载全部（.zip）
        </Button>
        <p className="text-xs text-muted-foreground">包含 spec.md、phases.md、AGENTS.md 三个文件</p>
      </div>

      <div className="mt-10 flex justify-between">
        <Button variant="outline" onClick={() => router.push('/preview/agents')}>← AGENTS.md</Button>
        <Button variant="outline" onClick={() => router.push('/wizard')}>🔄 重新开始</Button>
      </div>
    </div>
  );
}
