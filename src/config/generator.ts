import { RegisterSchema, updateCommandPrimitive } from "./index.ajv";
import Ajv, { ErrorObject } from "ajv/dist/2020.js";
import { validateConfig } from "../config";
import { AgentConfig } from "../../types/ai";

/**
 * 配置生成器
 */
export class ConfigGenerator {
  /**
   * 生成默认配置文件
   */
  static generateDefaultConfig(): AgentConfig {
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
        providers: [
          {
            name: 'claude-code-cli',
            enabled: false,
            path: '',
            args: ['--help'],
            promptTemplate: '生成以下功能的完整文档...'
          }
        ],
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
   * 二次覆盖配置（从用户输入或命令行参数）
   */
  static overrideConfig(
    baseConfig: AgentConfig,
    overrides: Partial<AgentConfig>
  ): AgentConfig {
    return {
      ...baseConfig,
      global: overrides.global ? { ...baseConfig.global, ...overrides.global } : baseConfig.global,
      preferences: overrides.preferences ? { ...baseConfig.preferences, ...overrides.preferences } : baseConfig.preferences,
      ai: overrides.ai ? { ...baseConfig.ai, ...overrides.ai } : baseConfig.ai
    };
  }

  /**
   * 生成用户配置文件路径
   */
  static generateUserConfigPath(defaultConfigPath: string): string {
    return defaultConfigPath.replace('default', 'user');
  }

  /**
   * 验证并加载配置
   */
  static async loadAndValidateConfig(configPath: string): Promise<AgentConfig> {
    const config = loadConfig(configPath);
    const validation = validateConfig(config);

    if (!validation.valid) {
      console.error('❌ 配置验证失败：');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      process.exit(1);
    }

    return config;
  }
}
