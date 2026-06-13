import { ProductSpec } from '../../types';

/**
 * 生成产品定义文档（一句话 + 给谁用 + 核心理念）
 */
export function generateProductContent(spec: ProductSpec): string {
  return `# ${spec.name}

## 一句话

${spec.description}

## 给谁用

${spec.targetUser}

## 核心功能

${spec.features.map((f, i) => `${i + 1}. **${f.name}** - ${f.description}`).join('\n')}
`;
}
