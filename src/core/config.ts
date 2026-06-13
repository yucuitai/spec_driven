import { AgentConfig } from '../types/ai';

/**
 * 加载配置文件
 */
export function loadConfig(path?: string): AgentConfig {
  const filePath = path || 'src/config/default.json';
  // TODO: 实现从路径读取 JSON 配置
  // 暂时返回默认配置
  return {
    global: {
      language: 'zh-CN',
      outputDir: 'docs',
      docBaseName: 'spec-driven-dev-tool-spec',
      branch: 'main'
    },
    preferences: {
      tone: '友好的工程师',
      detailLevel: '高'
    },
    ai: {
      providers: [],
      command: {
        dev: 'npm run dev',
        build: 'npm run build',
        test: 'npm test',
        lint: 'npm run lint'
      }
    }
  };
}

/**
 * 验证配置
 */
export function validateConfig(config: AgentConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.global || !config.global.outputDir) {
    errors.push('缺少 global.outputDir 配置');
  }

  if (!config.ai || !config.ai.command) {
    errors.push('缺少 ai.command 配置');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
