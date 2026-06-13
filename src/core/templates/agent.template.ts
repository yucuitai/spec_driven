/**
 * Agent 文档模板
 * 根据配置中的键名（如 agencies -> AGENTS.md, claudes -> CLAUDE.md, codexs -> CODEX.md）生成
 */
export const AGENT_TEMPLATE = \`# \${producerName} 配置

> 本文档由 Spec-Driven 工具生成

## 全局配置

- **偏好语调：** \${preferences.tone}
- **详细程度：** \${preferences.detailLevel}

## AI Tool 配置

\${producerConfigText}

## 项目结构

\${projectStructure}

## 常用命令

- 启动：\${ai.command.dev}
- 构建：\${ai.command.build}
- 测试：\${ai.command.test}
- Lint：\${ai.command.lint}

## 使用建议

1. 本文档为项目开发指南
2. 根据实际情况调整配置
3. 定制化使用建议

---
生成时间：\${timestamp}
\`;

/**
 * 生成 Agent 文档内容
 */
export function generateAgentContent(
  producerName: string,
  producerKey: string,
  preferences: any,
  projectStructure: string,
  aiConfig: any
): string {
  const producerConfigText = \`### 配置详情
- **名称：** \${producerName}
- **已启用：** \${aiConfig.enabled ? '是' : '否'}
\${aiConfig.path ? \`- **路径：** \${aiConfig.path}\` : ''}
- **命令参数：** \${aiConfig.args ? aiConfig.args.join(' ') : '无'}

---

*\${producerKey.toUpperCase()} 元文档提示：如果使用其他 AI 工具，请生成对应的 CLAUDE.md 或 CODEX.md 文档。*
\`;

  return AGENT_TEMPLATE
    .replace(/\$\{producerName\}/g, producerName)
    .replace(/\$\{producerKey\}/g, producerKey)
    .replace(/\$\{preferences.tone\}/g, preferences.tone)
    .replace(/\$\{preferences.detailLevel\}/g, preferences.detailLevel)
    .replace(/\$\{producerConfigText\}/g, producerConfigText)
    .replace(/\$\{projectStructure\}/g, projectStructure)
    .replace(/\$\{ai.command.dev\}/g, aiConfig.command.dev)
    .replace(/\$\{ai.command.build\}/g, aiConfig.command.build)
    .replace(/\$\{ai.command.test\}/g, aiConfig.command.test)
    .replace(/\$\{ai.command.lint\}/g, aiConfig.command.lint)
    .replace(/\$\{timestamp\}/g, new Date().toLocaleString('zh-CN'));
}
