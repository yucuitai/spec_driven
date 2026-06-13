import { AgentConfig } from '../../types/ai';

/**
 * 生成 AGENTS.md / 项目指令文件（模板保底版本）
 */
export function generateAgentContent(config: AgentConfig): string {
  const providerSection = config.ai.providers
    .filter((p) => p.enabled)
    .map(
      (p) => `### ${p.name}
- 路径：${p.path || '（未配置）'}
- 参数：${p.args && p.args.length ? p.args.join(' ') : '无'}`
    )
    .join('\n\n');

  return `# 项目开发指南

> 本文件由 Spec-Driven 工具生成，用于告诉 AI 工具（Codex / Claude Code / Cursor 等）如何在本仓库工作。

## 全局配置

- 语言偏好：${config.global.language}
- 输出目录：${config.global.outputDir}
- 文档基础名：${config.global.docBaseName}
- 默认分支：${config.global.branch}

## 偏好设置

- 语调：${config.preferences.tone}
- 详细程度：${config.preferences.detailLevel}

## 常用命令

- 启动：\`${config.ai.command.dev}\`
- 构建：\`${config.ai.command.build}\`
- 测试：\`${config.ai.command.test}\`
- Lint：\`${config.ai.command.lint}\`

## AI 工具配置

${providerSection || '> 暂未启用任何 AI 工具集成'}

## 硬性约束

- 修改前先阅读相关文件，不要凭直觉改动
- 保持现有代码风格与目录结构一致
- 不要引入未经讨论的新依赖
- 中文注释优先，UI 文案使用中文

---
生成时间：${new Date().toLocaleString('zh-CN')}
`;
}
