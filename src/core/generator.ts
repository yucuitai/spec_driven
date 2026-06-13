/**
 * 文档生成器 - 集成所有模板
 */
import { generateProductContent } from '../templates/product.template';
import { generateSpecContent } from '../templates/spec.template';
import { generatePhasesContent } from '../templates/phases.template';
import { generateAgentContent } from '../templates/agent.template';

/**
 * 生成器服务
 */
export class GeneratorService {
  /**
   * 生成产品文档
   */
  static generateProduct(spec: any): string {
    return generateProductContent(spec);
  }

  /**
   * 生成 Spec 文档
   */
  static generateSpec(spec: any): string {
    return generateSpecContent(spec);
  }

  /**
   * 生成 Phase 文档
   */
  static generatePhases(): string {
    return generatePhasesContent();
  }

  /**
   * 生成 Agent 文档
   */
  static generateAgent(
    producerName: string,
    producerKey: string,
    preferences: any,
    projectStructure: string,
    aiConfig: any
  ): string {
    return generateAgentContent(
      producerName,
      producerKey,
      preferences,
      projectStructure,
      aiConfig
    );
  }
}
