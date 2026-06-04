import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FollowUpItemProps {
  title: string;
  status: 'pending' | 'completed';
  statusLabel: string;
  time: string;
  day: string;
  onAction: () => void;
}

export default function FollowUpItem({
  title,
  status,
  statusLabel,
  time,
  day,
  onAction,
}: FollowUpItemProps) {
  const { t } = useTranslation();
  const isPending = status === 'pending';

  return (
    <div
      onClick={onAction}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Calendar Icon */}
        <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400">
          <Calendar className="h-6 w-6 stroke-[1.8]" />
        </div>

        {/* Info Column */}
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
              {title}
            </h4>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isPending
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50'
              }`}
            >
              {statusLabel}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{time}</span>
            <span>•</span>
            <span>{day}</span>
          </div>
        </div>
      </div>

      {/* Button & Arrow */}
      <div className="flex items-center gap-4 shrink-0 pl-3">
        {isPending ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="bg-primary hover:bg-primary-700 active:bg-primary-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 cursor-pointer text-sm"
          >
            {t('dashboard.pages.suivis.commencer', 'Commencer')}
          </button>
        ) : (
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            {t('dashboard.pages.suivis.consulter', 'Voir')}
          </span>
        )}
        <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500" />
      </div>
    </div>
  );
}
