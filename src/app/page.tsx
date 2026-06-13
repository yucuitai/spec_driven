import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  { title: '产品定义向导', description: '交互式表单引导你逐步填写产品信息，从名称到核心功能', icon: '📝' },
  { title: 'Spec 文档生成', description: '自动生成结构化的产品规格文档，包含功能列表和用户流程', icon: '📋' },
  { title: 'Phase 阶段拆分', description: '把 Spec 自动拆分成可执行的开发阶段，每个阶段可运行', icon: '🎯' },
  { title: 'AGENTS.md 生成', description: '根据技术栈生成 AI 工具配置文档，让 AI 更好地理解你的项目', icon: '🤖' },
  { title: 'AI 增强', description: '接入 OpenAI 兼容 API，让 AI 帮你润色 Spec、拆解 Phase、完善文档', icon: '✨' },
  { title: '一键导出', description: '下载 Markdown 文档或打包下载，直接用于项目开发', icon: '📦' },
];

const steps = [
  { step: '1', label: '填写产品信息', desc: '名称、描述、目标用户' },
  { step: '2', label: '生成 Spec', desc: '自动结构化文档' },
  { step: '3', label: '拆分 Phase', desc: '可执行的开发阶段' },
  { step: '4', label: '导出文档', desc: 'Markdown / ZIP' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative flex flex-col items-center justify-center gap-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Spec-Driven 开发流程工具
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            从想法到
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              完整文档
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
            你负责想清楚要什么，AI 负责实现。
            <br />
            这个工具帮你把「想清楚」这件事结构化。
          </p>
          <div className="flex gap-4 mt-2">
            <Link href="/wizard">
              <Button size="lg" className="h-11 px-8">开始创建 →</Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="lg" className="h-11 px-8">⚙️ 配置 AI</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 流程 */}
      <section className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg mb-3">
                {s.step}
              </div>
              <p className="font-medium text-sm">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] border-t border-dashed border-muted-foreground/20" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 特性 */}
      <section className="container py-16">
        <h2 className="text-2xl font-bold text-center mb-2">核心功能</h2>
        <p className="text-center text-muted-foreground mb-10">一站式完成从产品定义到文档导出的全流程</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xl">
                    {feature.icon}
                  </span>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <div className="rounded-2xl border bg-muted/30 p-12">
          <h2 className="text-2xl font-bold mb-3">准备好开始了吗？</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            只需要几分钟，就能生成完整的项目文档。配置 API Key 后还能获得 AI 增强建议。
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/wizard">
              <Button size="lg" className="h-11 px-8">立即开始</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          Spec-Driven — 交互式开发文档生成工具
        </div>
      </footer>
    </div>
  );
}
