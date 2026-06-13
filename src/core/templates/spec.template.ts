import { ProductSpec } from '../../types';

/**
 * 生成 Spec 文档（模板保底版本）
 * MVP 阶段：纯字符串拼接，不依赖 LLM
 */
export function generateSpecContent(spec: ProductSpec): string {
  const featureList = spec.features
    .map(
      (f, i) => `### ${i + 1}. ${f.name}

${f.description}`
    )
    .join('\n\n');

  const stack = spec.techStackPreference?.trim();
  const style = spec.codeStylePreference?.trim();

  return `---
title: ${spec.name} - 产品规格
date: ${new Date().toISOString().slice(0, 10)}
---

# ${spec.name}

## 产品定义

**一句话**：${spec.description}

**给谁用**：${spec.targetUser}

**核心理念**：你负责想清楚要什么，AI 负责实现。

---

## 核心功能

${featureList}

---

## 页面 / 视图

| 页面 | 说明 |
|---|---|
| 首页 | 产品介绍 + 开始按钮 |
| 主功能页 | 核心功能入口 |
| 详情页 | 功能详情与操作 |

> 这一节由模板生成，建议在预览页使用「AI 完善」基于你的功能列表给出更精确的页面拆分。

---

## 数据模型

待补充：根据核心功能定义实体、字段与关系。

> 建议使用「AI 完善」结合上方功能列表给出建议数据模型。

---

## 用户流程

\`\`\`
打开首页 → 进入主功能 → 完成操作 → 查看结果
\`\`\`

---

## 技术偏好

${stack ? `- 技术栈偏好：${stack}` : '- 技术栈：未指定（建议在 AGENTS 配置页选择）'}
${style ? `- 代码风格偏好：${style}` : '- 代码风格：未指定'}

---

## 备注

- 本文档由 Spec-Driven 工具生成，可在预览页继续编辑
- 模板内容是保底基线；配置 API Key 后可使用 AI 完善
`;
}
