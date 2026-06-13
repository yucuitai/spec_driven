/**
 * Spec 文档模板
 */
export const SPEC_TEMPLATE = \`# 产品规格文档

## 产品概述
\${overview}

## 功能列表

${featureList.map((f, i) => `
### ${i + 1}. ${f.name}
- 描述：\${f.description}
`).join('')}

## 页面/视图描述

${pageViews.map((p, i) => `
### ${p.name}
- 功能：\${p.desc}
`).join('')}

## 数据模型

\${dataModels}

## 用户流程

\${userFlow}
\`;

/**
 * 生成 Spec 文档内容
 */
export function generateSpecContent(spec: ProductSpec): string {
  return SPEC_TEMPLATE
    .replace(/\$\{overview\}/g, \`这是一个 \${spec.name}，旨在帮助 \${spec.targetUser} 更高效地完成工作。\`)
    .replace(
      /\$\{featureList.*?\}/s,
      spec.features
        .map((f, i) => \`### \${i + 1}. \${f.name}
- 描述：\${f.description}\`)
        .join('\\n\\n')
    )
    .replace(
      /\$\{pageViews.*?\}/s,
      '### 待补充页面和视图描述'
    )
    .replace(/\$\{dataModels\}/g, '基于需求定义的数据模型（待填充）')
    .replace(/\$\{userFlow\}/g, '用户主要操作流程（待填充）');
}
