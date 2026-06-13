/**
 * 产品文档模板
 */
export const PRODUCT_TEMPLATE = \`# \${name}

## 一句话描述
\${description}

## 目标用户
\${targetUser}

## 核心功能
${features.map((f, i) => `
### ${i + 1}. ${f.name}
- 描述：\${f.description}
- 难度：\${f.difficulty || '待定'}/5
- 预计时间：\${f.estimateTime || '待定'}
`).join('')}

## 技术栈偏好
\${techStackPreference || '根据需求确定'}

## 代码风格偏好
\${codeStylePreference || '标准化'}
\`;

/**
 * 生成产品文档内容
 */
export function generateProductContent(spec: ProductSpec): string {
  return PRODUCT_TEMPLATE
    .replace(/\$\{name\}/g, spec.name)
    .replace(/\$\{description\}/g, spec.description)
    .replace(/\$\{targetUser\}/g, spec.targetUser)
    .replace(/\$\{techStackPreference\}/g, spec.techStackPreference || '根据需求确定')
    .replace(/\$\{codeStylePreference\}/g, spec.codeStylePreference || '标准化')
    .replace(
      /\$\{features.*?\}/s,
      spec.features
        .map((f, i) => \`### \${i + 1}. \${f.name}
- 描述：\${f.description}
- 难度：\${f.difficulty || '待定'}/5
- 预计时间：\${f.estimateTime || '待定'}\`)
        .join('\\n\\n')
    );
}
