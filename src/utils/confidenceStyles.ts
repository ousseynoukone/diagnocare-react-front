export interface ConfidenceStyles {
  text: string;
  bar: string;
  badge: string;
}

export function getConfidenceStyles(score: number): ConfidenceStyles {
  if (score >= 70) {
    return {
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-500 dark:bg-emerald-400',
      badge: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50',
    };
  } else if (score >= 40) {
    return {
      text: 'text-amber-650 dark:text-amber-400',
      bar: 'bg-amber-500 dark:bg-amber-400',
      badge: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
    };
  } else {
    return {
      text: 'text-indigo-600 dark:text-indigo-450',
      bar: 'bg-indigo-500 dark:bg-indigo-400',
      badge: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50',
    };
  }
}
