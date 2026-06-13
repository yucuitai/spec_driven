import type { ProductSpec, Feature } from '@/types';

const SYSTEM_BASE =
  '你是一位资深产品工程师与 Spec-Driven 开发教练。回答务必：1) 全部使用简体中文；2) 直击重点不啰嗦；3) 优先给出可直接采纳的结论而不是反问。除非用户输入信息不足，否则不要让用户补全更多细节。';

export type WizardStepKey = 'product' | 'features' | 'tech' | 'review';

export interface WizardContext {
  name: string;
  description: string;
  targetUser: string;
  features: Feature[];
  techStackPreference?: string;
  codeStylePreference?: string;
}

function ctxBlock(c: WizardContext): string {
  const lines = [
    `产品名称：${c.name || '（未填）'}`,
    `一句话描述：${c.description || '（未填）'}`,
    `目标用户：${c.targetUser || '（未填）'}`,
  ];
  const feats = c.features.filter((f) => f.name?.trim() || f.description?.trim());
  if (feats.length) {
    lines.push('已填核心功能：');
    feats.forEach((f, i) => lines.push(`  ${i + 1}. ${f.name || '（未命名）'} - ${f.description || '（无描述）'}`));
  }
  if (c.techStackPreference) lines.push(`技术栈偏好：${c.techStackPreference}`);
  if (c.codeStylePreference) lines.push(`代码风格：${c.codeStylePreference}`);
  return lines.join('\n');
}

export function buildWizardPrompt(step: WizardStepKey, ctx: WizardContext) {
  const system = SYSTEM_BASE;
  let user = '';
  switch (step) {
    case 'product':
      user = [
        '请基于已有产品信息，给出三方面参考：',
        '1. 一句话描述润色建议（如已填好则保留并做轻度优化）',
        '2. 目标用户画像补全（年龄段 / 场景 / 痛点）',
        '3. 与之相似的 1-2 个参考产品（说明它们的差异点）',
        '',
        '已知信息：',
        ctxBlock(ctx),
        '',
        '输出使用清晰的 Markdown 小标题，控制在 250 字以内。',
      ].join('\n');
      break;
    case 'features':
      user = [
        '请基于产品上下文，推荐 3-5 个核心功能。要求：',
        '- 每条功能用 "功能名 - 一句话描述" 的格式',
        '- 优先 MVP 必备能力，不要列锦上添花的功能',
        '- 不要超过 5 条',
        '- 直接给清单，不要前置废话',
        '',
        '已知信息：',
        ctxBlock(ctx),
      ].join('\n');
      break;
    case 'tech':
      user = [
        '请根据产品类型给出技术栈与代码风格建议：',
        '1. 推荐技术栈（框架 / UI / 状态管理 / 存储 / 部署），并简述理由',
        '2. 代码风格关键约束（2-3 条）',
        '',
        '已知信息：',
        ctxBlock(ctx),
        '',
        '使用简洁的 Markdown 表格或分点输出，控制在 300 字以内。',
      ].join('\n');
      break;
    case 'review':
      user = [
        '请评估当前信息是否足够生成高质量 Spec：',
        '1. 给出 "是 / 否 / 勉强可用" 的结论',
        '2. 列出 1-3 个最该补全或澄清的关键点（如果有）',
        '3. 简要预测可能产生的 Spec 弱点',
        '',
        '已知信息：',
        ctxBlock(ctx),
      ].join('\n');
      break;
  }
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ];
}

export function buildSpecRewritePrompt(spec: ProductSpec, current: string) {
  const system = SYSTEM_BASE + '\n你将基于现有 Spec 文档进行整体完善，输出完整 Markdown，不要解释。';
  const user = [
    '请基于产品上下文重写并完善以下 Spec 文档。要求：',
    '- 保留原有结构（产品定义 / 核心功能 / 页面 / 数据模型 / 用户流程）',
    '- 补全模板里 "待补充" 的章节，给出可执行的具体内容',
    '- 数据模型给出主要实体、字段、关系',
    '- 用户流程拆解为 3-7 个清晰步骤',
    '- 中文 Markdown，禁止输出 ```markdown 代码块包裹',
    '',
    '产品上下文：',
    `名称：${spec.name}`,
    `描述：${spec.description}`,
    `目标用户：${spec.targetUser}`,
    `核心功能：\n${spec.features.map((f, i) => `  ${i + 1}. ${f.name} - ${f.description}`).join('\n')}`,
    spec.techStackPreference ? `技术栈：${spec.techStackPreference}` : '',
    '',
    '当前 Spec：',
    current,
  ].filter(Boolean).join('\n');
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ];
}

export function buildPhasesRewritePrompt(spec: ProductSpec, current: string) {
  const system = SYSTEM_BASE + '\n你将根据 Spec-Driven 原则重新拆解 Phase。';
  const user = [
    '请基于产品上下文重新拆解开发 Phase。原则：',
    '- 先骨架后细节',
    '- 每个 Phase 结束时产品可运行',
    '- 总数控制在 6-9 个 Phase',
    '- 不要按功能机械对应一个 Phase，而是按 "先跑通主流程，再丰富功能，最后打磨" 的节奏',
    '- 每个 Phase 给出：标题 / 目标 / 交付物 / 验收标准',
    '- 输出完整 Markdown，不要使用 ```markdown 代码块包裹',
    '',
    '产品上下文：',
    `名称：${spec.name}`,
    `描述：${spec.description}`,
    `核心功能：\n${spec.features.map((f, i) => `  ${i + 1}. ${f.name} - ${f.description}`).join('\n')}`,
    spec.techStackPreference ? `技术栈：${spec.techStackPreference}` : '',
    '',
    '当前 Phase 拆解：',
    current,
  ].filter(Boolean).join('\n');
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ];
}

export function buildAgentsRewritePrompt(spec: ProductSpec, current: string) {
  const system = SYSTEM_BASE + '\n你将完善给 AI 工具用的项目指令文件 AGENTS.md。';
  const user = [
    '请基于产品上下文完善 AGENTS.md。要求：',
    '- 补全 "硬性约束" 章节，列出 4-8 条针对本项目的具体约束',
    '- 在 "代码风格" 给出本项目应遵循的规范',
    '- 项目结构章节给出建议目录树',
    '- 中文 Markdown，禁止使用 ```markdown 代码块包裹整体输出',
    '',
    '产品上下文：',
    `名称：${spec.name}`,
    `描述：${spec.description}`,
    spec.techStackPreference ? `技术栈：${spec.techStackPreference}` : '',
    spec.codeStylePreference ? `代码风格：${spec.codeStylePreference}` : '',
    '',
    '当前 AGENTS.md：',
    current,
  ].filter(Boolean).join('\n');
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ];
}
