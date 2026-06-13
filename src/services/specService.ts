import { ProductSpec } from '../types/product';

/**
 * 服务层：文档生成核心逻辑
 */
export class SpecService {
  /**
   * 生成产品文档
   */
  static async generateProduct(spec: ProductSpec): Promise<string> {
    // TODO: 实现产品文档生成逻辑
    return \`# \${spec.name}

## 一句话描述
\${spec.description}

## 目标用户
\${spec.targetUser}

## 核心功能
\${spec.features.map((f, i) => \`\${i + 1}. \${f.name} - \${f.description}\`).join('\\n')}
\`;
  }
}
