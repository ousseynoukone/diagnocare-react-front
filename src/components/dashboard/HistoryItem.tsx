import { Calendar, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HistoryItemProps {
  title: string;
  specialist: string;
  date: string;
  confidence: number;
  alert?: boolean;
  onViewDetails: () => void;
}

export default function HistoryItem({
  title,
  specialist,
  date,
  confidence,
  alert = false,
  onViewDetails,
}: HistoryItemProps) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onViewDetails}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Icon */}
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
            alert
              ? 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400'
          }`}
        >
          {alert ? (
            <AlertTriangle className="h-6 w-6 stroke-[1.8]" />
          ) : (
            <Calendar className="h-6 w-6 stroke-[1.8]" />
          )}
        </div>

        {/* Text Info */}
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
              {title}
            </h4>
            {alert && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                {t('dashboard.pages.historique.alert_tag', 'Alerte')}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            <span className="text-slate-400 dark:text-slate-500 mr-1">
              {t('dashboard.pages.historique.recommendation_prefix', 'Recommandation :')}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {specialist}
            </span>
          </p>
        </div>
      </div>

      {/* Stats and Action Details */}
      <div className="flex items-center justify-between sm:justify-end gap-8 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
        {/* Date */}
        <div className="sm:text-right">
          <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">
            {t('dashboard.pages.historique.date_label', 'Date')}
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {date}
          </span>
        </div>

        {/* Confidence */}
        <div className="sm:text-right">
          <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">
            {t('dashboard.home.recent_evaluations.confidence', 'Confiance')}
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {confidence} %
          </span>
        </div>

        {/* Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs shrink-0 cursor-pointer"
        >
          {t('dashboard.pages.historique.details_button', 'Détails')}
        </button>
      </div>
    </div>
  );
}
