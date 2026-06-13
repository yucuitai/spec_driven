/**
 * 产品规格相关类型定义
 */
export interface ProductSpec {
  name: string;
  description: string;
  targetUser: string;
  features: Feature[];
  techStackPreference?: string;
  codeStylePreference?: string;
}

export interface Feature {
  name: string;
  description: string;
  difficulty?: number; // 1-5
  estimateTime?: string; // 1-5 min
}

/**
 * Spec 文档类型
 */
export interface SpecDocument {
  name: string;
  sections: SpecSection[];
}

export interface SpecSection {
  title: string;
  content: string;
}

/**
 * Phase 相关类型
 */
export interface Phase {
  name: string;
  description: string;
  deliverables: string[];
  estimatedTime: string;
}

export interface PhasesDocument {
  phases: Phase[];
}
