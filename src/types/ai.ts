/**
 * AI 配置相关类型
 */
export interface AiProvider {
  name: string;
  enabled: boolean;
  path: string;
  args?: string[];
  promptTemplate?: string;
}

export interface CommandConfig {
  dev: string;
  build: string;
  test: string;
  lint: string;
}

export interface AiConfig {
  providers: AiProvider[];
  command: CommandConfig;
}

/**
 * Agent 配置类型
 */
export interface GlobalConfig {
  language: string;
  outputDir: string;
  docBaseName: string;
  branch: string;
}

export interface PreferencesConfig {
  tone: string;
  detailLevel: string;
}

export interface AgentConfig {
  global: GlobalConfig;
  preferences: PreferencesConfig;
  ai: AiConfig;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
