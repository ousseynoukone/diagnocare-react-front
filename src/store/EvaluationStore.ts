import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { EvaluationState } from '../types/models/enums/EvaluationStateEnum';

type EvaluationStore = {
    evaluationState: EvaluationState;
    setEvaluationState: (state: EvaluationState) => void;
    clearEvaluationState: () => void;
}

export const useEvaluationStore = create<EvaluationStore>()(
    persist(
        (set) => ({
            evaluationState: EvaluationState.START,
            setEvaluationState: (state) => set({ evaluationState: state }),
            clearEvaluationState: () => set({ evaluationState: EvaluationState.START }),
        }),
        {
            name: 'diagnocare-evaluation',
        }
    )
)