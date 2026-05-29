import { create } from 'zustand';

interface AppraisalWizardState {
  photos: string[];
  currentStepIndex: number;
  updateField: (field: string, value: any) => void;
}

export const useAppraisalWizardStore = create<AppraisalWizardState>((set) => ({
  photos: [],
  currentStepIndex: 2,
  updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
}));
