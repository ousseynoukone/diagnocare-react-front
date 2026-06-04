import { Activity, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EvaluationItemProps {
  title: string;
  symptoms: string;
  date: string;
  confidence: number;
  urgent?: boolean;
  onClick: () => void;
}

export default function EvaluationItem({
  title,
  symptoms,
  date,
  confidence,
  urgent = false,
  onClick,
}: EvaluationItemProps) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Pulse / Activity Icon */}
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
            urgent
              ? 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400'
          }`}
        >
          <Activity className="h-6 w-6 stroke-[1.8]" />
        </div>

        {/* Text Details */}
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
              {title}
            </h4>
            {urgent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                {t('dashboard.home.recent_evaluations.attention_required', 'Attention requise')}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {symptoms}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {date}
          </p>
        </div>
      </div>

      {/* Confidence and Action Chevron */}
      <div className="flex items-center gap-4 shrink-0 pl-3">
        <div className="text-right">
          <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">
            {t('dashboard.home.recent_evaluations.confidence', 'Confiance')}
          </span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            {confidence} %
          </span>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500" />
      </div>
    </div>
  );
}
