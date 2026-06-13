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
