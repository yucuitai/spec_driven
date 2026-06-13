'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useAiSettings } from '@/lib/ai/store';
import { buildWizardPrompt, type WizardStepKey, type WizardContext } from '@/lib/ai/prompts';
import { GeneratorService } from '@/core/generator';
import { loadConfig } from '@/core/config';
import { AIPanel } from '@/components/ai/AIPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ProductSpec, Feature } from '@/types';

const STEPS = [
  { title: '产品信息', description: '告诉我们你的产品是什么', key: 'product' as WizardStepKey },
  { title: '核心功能', description: '列出产品的核心功能（3-5 个）', key: 'features' as WizardStepKey },
  { title: '技术偏好', description: '选择技术栈和代码风格', key: 'tech' as WizardStepKey },
  { title: '确认生成', description: '检查信息并生成文档', key: 'review' as WizardStepKey },
];

export default function WizardPage() {
  const router = useRouter();
  const { productSpec, setProductSpec, setSpecContent, setPhasesContent, setAgentContent } = useAppStore();
  const hasKey = useAiSettings((s) => Boolean(s.apiKey));
  const [currentStep, setCurrentStep] = useState(0);
  const [showAI, setShowAI] = useState(false);

  const [name, setName] = useState(productSpec?.name || '');
  const [description, setDescription] = useState(productSpec?.description || '');
  const [targetUser, setTargetUser] = useState(productSpec?.targetUser || '');
  const [features, setFeatures] = useState<Feature[]>(
    productSpec?.features || [{ name: '', description: '' }]
  );
  const [techStackPreference, setTechStackPreference] = useState(productSpec?.techStackPreference || '');
  const [codeStylePreference, setCodeStylePreference] = useState(productSpec?.codeStylePreference || '');

  const addFeature = () => {
    if (features.length < 5) setFeatures([...features, { name: '', description: '' }]);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    setFeatures(features.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return name.trim() && description.trim() && targetUser.trim();
      case 1: return features.every((f) => f.name.trim() && f.description.trim());
      default: return true;
    }
  };

  const buildCtx = (): WizardContext => ({
    name, description, targetUser, features,
    techStackPreference: techStackPreference || undefined,
    codeStylePreference: codeStylePreference || undefined,
  });

  const handleGenerate = () => {
    const spec: ProductSpec = {
      name: name.trim(),
      description: description.trim(),
      targetUser: targetUser.trim(),
      features: features.filter((f) => f.name.trim()),
      techStackPreference: techStackPreference.trim() || undefined,
      codeStylePreference: codeStylePreference.trim() || undefined,
    };

    setProductSpec(spec);
    setSpecContent(GeneratorService.generateSpec(spec));
    setPhasesContent(GeneratorService.generatePhases(spec));
    setAgentContent(GeneratorService.generateAgent(loadConfig()));

    router.push('/preview/spec');
  };

  return (
    <div className="container max-w-3xl py-10">
      {/* 步骤指示器 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={`flex items-center gap-2 transition-colors ${i <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  i < currentStep
                    ? 'bg-green-500 text-white'
                    : i === currentStep
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i === currentStep ? 'font-medium' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 h-px w-8 ${i < currentStep ? 'bg-green-500' : 'bg-muted'}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{STEPS[currentStep].title}</CardTitle>
              <CardDescription>{STEPS[currentStep].description}</CardDescription>
            </div>
            {hasKey && (
              <Button variant="outline" size="sm" onClick={() => setShowAI(!showAI)}>
                {showAI ? '隐藏 AI' : '✨ AI 辅助'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showAI && hasKey && (
            <div className="mb-6">
              <AIPanel
                title={`AI 建议 — ${STEPS[currentStep].title}`}
                triggerLabel="获取 AI 建议"
                buildMessages={() => buildWizardPrompt(STEPS[currentStep].key, buildCtx())}
                helperText="AI 将根据你已填信息给出建议"
              />
            </div>
          )}

          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">产品名称 *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：Spec-Driven" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">一句话描述 *</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="用一句话描述你的产品" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">目标用户 *</label>
                <Input value={targetUser} onChange={(e) => setTargetUser(e.target.value)} placeholder="例如：独立开发者、AI 编程新手" className="mt-1.5" />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">功能 {index + 1}</span>
                    {features.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeFeature(index)} className="h-7 text-xs">删除</Button>
                    )}
                  </div>
                  <Input value={feature.name} onChange={(e) => updateFeature(index, 'name', e.target.value)} placeholder="功能名称" />
                  <Textarea value={feature.description} onChange={(e) => updateFeature(index, 'description', e.target.value)} placeholder="功能描述" rows={2} />
                </div>
              ))}
              {features.length < 5 && (
                <Button variant="outline" onClick={addFeature} className="w-full">+ 添加功能</Button>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">技术栈偏好（可选）</label>
                <Input value={techStackPreference} onChange={(e) => setTechStackPreference(e.target.value)} placeholder="例如：React + TypeScript + Node.js" className="mt-1.5" />
                <p className="text-xs text-muted-foreground mt-1.5">留空则由 AI 根据产品类型推荐</p>
              </div>
              <div>
                <label className="text-sm font-medium">代码风格偏好（可选）</label>
                <Input value={codeStylePreference} onChange={(e) => setCodeStylePreference(e.target.value)} placeholder="例如：标准化、函数式、面向对象" className="mt-1.5" />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-5 space-y-3">
                <div className="grid grid-cols-[80px_1fr] gap-y-2 text-sm">
                  <span className="text-muted-foreground font-medium">名称</span>
                  <span className="font-medium">{name}</span>
                  <span className="text-muted-foreground font-medium">描述</span>
                  <span>{description}</span>
                  <span className="text-muted-foreground font-medium">用户</span>
                  <span>{targetUser}</span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground font-medium mb-2">核心功能</p>
                  <ul className="space-y-1">
                    {features.filter((f) => f.name.trim()).map((f, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium">{f.name}</span>
                        <span className="text-muted-foreground"> — {f.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {(techStackPreference || codeStylePreference) && (
                  <div className="border-t pt-3 grid grid-cols-[80px_1fr] gap-y-2 text-sm">
                    {techStackPreference && (
                      <><span className="text-muted-foreground font-medium">技术栈</span><span>{techStackPreference}</span></>
                    )}
                    {codeStylePreference && (
                      <><span className="text-muted-foreground font-medium">代码风格</span><span>{codeStylePreference}</span></>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                点击「生成文档」将自动生成 Spec、Phase 计划和 AGENTS.md
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>← 上一步</Button>
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>下一步 →</Button>
        ) : (
          <Button onClick={handleGenerate} size="lg">🚀 生成文档</Button>
        )}
      </div>
    </div>
  );
}
