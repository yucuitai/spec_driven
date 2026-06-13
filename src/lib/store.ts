import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductSpec } from '@/types';

interface AppState {
  // 向导数据
  productSpec: ProductSpec | null;
  // 生成的文档
  specContent: string | null;
  phasesContent: string | null;
  agentContent: string | null;
  // 向导步骤
  currentStep: number;
  // 水合状态
  _hasHydrated: boolean;
  // actions
  setProductSpec: (spec: ProductSpec) => void;
  setSpecContent: (content: string) => void;
  setPhasesContent: (content: string) => void;
  setAgentContent: (content: string) => void;
  setCurrentStep: (step: number) => void;
  setHasHydrated: (v: boolean) => void;
  reset: () => void;
}

const initialState = {
  productSpec: null,
  specContent: null,
  phasesContent: null,
  agentContent: null,
  currentStep: 0,
  _hasHydrated: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      setProductSpec: (spec) => set({ productSpec: spec }),
      setSpecContent: (content) => set({ specContent: content }),
      setPhasesContent: (content) => set({ phasesContent: content }),
      setAgentContent: (content) => set({ agentContent: content }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      reset: () => set(initialState),
    }),
    {
      name: 'spec-driven-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
