import { Calendar, Clock, ChevronRight, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FollowUpItemProps {
  title: string;
  status: 'pending' | 'completed' | 'locked';
  statusLabel: string;
  time: string;
  day: string;
  lockedUntil?: string;
  onAction: () => void;
}

export default function FollowUpItem({
  title,
  status,
  statusLabel,
  time,
  day,
  lockedUntil,
  onAction,
}: FollowUpItemProps) {
  const { t } = useTranslation();
  const isPending = status === 'pending';
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <div
      onClick={isPending ? onAction : isCompleted ? onAction : undefined}
      className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 flex items-center justify-between shadow-sm transition-all duration-200 ${
        isLocked
          ? 'border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed'
          : 'border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Icon */}
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
          isLocked
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400'
        }`}>
          {isLocked
            ? <Lock className="h-6 w-6 stroke-[1.8]" />
            : <Calendar className="h-6 w-6 stroke-[1.8]" />
          }
        </div>

        {/* Info Column */}
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{title}</h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isPending
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
                : isLocked
                  ? 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50'
            }`}>
              {statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{time}</span>
            <span>•</span>
            <span>{day}</span>
          </div>

          {isLocked && lockedUntil && (
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {t('dashboard.pages.suivis.available_from', 'Disponible à partir du')} {lockedUntil}
            </p>
          )}
        </div>
      </div>

      {/* Button & Arrow */}
      <div className="flex items-center gap-4 shrink-0 pl-3">
        {isPending ? (
          <button
            onClick={(e) => { e.stopPropagation(); onAction(); }}
            className="bg-primary hover:bg-primary-700 active:bg-primary-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 cursor-pointer text-sm"
          >
            {t('dashboard.pages.suivis.commencer', 'Commencer')}
          </button>
        ) : isCompleted ? (
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            {t('dashboard.pages.suivis.consulter', 'Voir')}
          </span>
        ) : null}
        <ChevronRight className={`h-5 w-5 ${isLocked ? 'text-slate-300 dark:text-slate-700' : 'text-slate-400 dark:text-slate-500'}`} />
      </div>
    </div>
  );
}
