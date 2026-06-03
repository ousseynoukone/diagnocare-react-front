export const EvaluationState = {
  START: 'START',
  SELECTION: 'SELECTION',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
  SEARCH_SPECIALIST: 'SEARCH_SPECIALIST',
} as const;

export type EvaluationState = typeof EvaluationState[keyof typeof EvaluationState];
