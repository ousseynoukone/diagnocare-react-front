import { X, TrendingDown, Minus, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CheckInResponseDTO } from '../../../api-s/requests/CheckInRequest';

interface CheckInResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CheckInResponseDTO | null;
  diseaseTitle: string;
}

const WORSE_REASONS: Record<string, { fr: string; en: string }> = {
  red_alert: {
    fr: "Alerte rouge détectée — symptômes critiques signalés",
    en: "Red alert detected — critical symptoms reported",
  },
  urgent_disease: {
    fr: "Pathologie urgente identifiée par l'IA",
    en: "Urgent pathology identified by the AI",
  },
  score_increase: {
    fr: "Augmentation significative du score de probabilité (+10 pts)",
    en: "Significant probability score increase (+10 pts)",
  },
};

export default function CheckInResultModal({ isOpen, onClose, result, diseaseTitle }: CheckInResultModalProps) {
  const { t, i18n } = useTranslation();
  const isFr = i18n.language.startsWith('fr');

  if (!isOpen || !result) return null;

  const outcome = result.outcome;
  const prevScore = result.previousBestScore != null ? Math.round(Number(result.previousBestScore)) : null;
  const newScore = result.newBestScore != null ? Math.round(Number(result.newBestScore)) : null;
  const delta = result.bestScoreDelta != null ? Math.round(Number(result.bestScoreDelta)) : null;

  const worseReasonKeys = result.worseReason
    ? result.worseReason.split(';').map((r) => r.trim()).filter(Boolean)
    : [];

  const config = {
    IMPROVING: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-900/40',
      icon: TrendingDown,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      titleColor: 'text-emerald-700 dark:text-emerald-300',
      label: isFr ? 'EN AMÉLIORATION' : 'IMPROVING',
      desc: isFr
        ? 'Vos symptômes montrent une évolution positive. Continuez votre traitement actuel.'
        : 'Your symptoms show a positive evolution. Continue your current treatment.',
    },
    STABLE: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-900/40',
      icon: Minus,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      titleColor: 'text-amber-700 dark:text-amber-300',
      label: isFr ? 'STABLE' : 'STABLE',
      desc: isFr
        ? 'Pas d\'évolution significative. Surveillez vos symptômes et consultez si des changements surviennent.'
        : 'No significant change. Monitor your symptoms and consult a doctor if changes occur.',
    },
    WORSENING: {
      bg: 'bg-red-50 dark:bg-red-950/20',
      border: 'border-red-200 dark:border-red-900/40',
      icon: TrendingUp,
      iconColor: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      titleColor: 'text-red-700 dark:text-red-300',
      label: isFr ? 'EN AGGRAVATION' : 'WORSENING',
      desc: isFr
        ? 'Vos symptômes semblent s\'aggraver. Consultez votre médecin rapidement.'
        : 'Your symptoms seem to be worsening. Please consult a doctor promptly.',
    },
  };

  const c = outcome ? config[outcome] : config.STABLE;
  const Icon = c.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('dashboard.pages.suivis.result_modal_title', 'Résultat du suivi')}
            </h2>
            <p className="text-xs text-slate-400 font-semibold">{diseaseTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Outcome card */}
          <div className={`${c.bg} ${c.border} border rounded-2xl p-5 flex items-start gap-4`}>
            <div className={`${c.iconBg} p-2.5 rounded-xl shrink-0`}>
              <Icon className={`h-6 w-6 ${c.iconColor}`} />
            </div>
            <div className="space-y-1">
              <p className={`text-base font-extrabold tracking-wide uppercase ${c.titleColor}`}>
                {c.label}
              </p>
              <p className={`text-sm font-medium ${c.titleColor} opacity-80`}>
                {c.desc}
              </p>
            </div>
          </div>

          {/* Score comparison */}
          {prevScore != null && newScore != null && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('dashboard.pages.suivis.score_comparison', 'Comparaison des scores IA')}
                </p>
                {delta != null && (
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                    delta < 0
                      ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : delta > 0
                        ? 'text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400'
                        : 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {delta > 0 ? '+' : ''}{delta}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('dashboard.pages.suivis.before', 'Avant')}
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{prevScore}%</p>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('dashboard.pages.suivis.after', 'Après')}
                  </p>
                  <p className={`text-2xl font-extrabold ${
                    delta != null && delta < 0 ? 'text-emerald-600 dark:text-emerald-400' :
                    delta != null && delta > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
                  }`}>{newScore}%</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center">
                {isFr
                  ? 'Un score plus bas indique que la pathologie est moins probable.'
                  : 'A lower score means the pathology is less likely.'}
              </p>
            </div>
          )}

          {/* Worse reasons */}
          {worseReasonKeys.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wide">
                  {isFr ? 'Facteurs d\'aggravation détectés' : 'Worsening factors detected'}
                </p>
              </div>
              <ul className="space-y-1 pl-6 list-disc">
                {worseReasonKeys.map((key) => (
                  <li key={key} className="text-xs font-medium text-red-700 dark:text-red-300">
                    {(WORSE_REASONS[key]?.[isFr ? 'fr' : 'en']) ?? key}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* WORSENING: urgent recommendation */}
          {outcome === 'WORSENING' && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-4 flex gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 leading-relaxed">
                {isFr
                  ? 'Consultez un professionnel de santé dès que possible. En cas d\'urgence, appelez le 15 (SAMU).'
                  : 'Consult a healthcare professional as soon as possible. In case of emergency, call emergency services.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-md">
            {t('common.close', 'Fermer')}
          </button>
        </div>
      </div>
    </div>
  );
}
