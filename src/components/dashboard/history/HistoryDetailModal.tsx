import { useState } from 'react';
import { Activity, Download, AlertTriangle, Trash2, X, CheckCircle, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { HydratedPrediction } from '../../../types/models/Prediction';
import type { DiagnosisPossibility } from '../../../types/models/Evaluation';
import { getConfidenceStyles } from '../../../utils/confidenceStyles';
import { useDownloadPDF } from '../../../hooks/useDownloadPDF';
import ReportModal from '../../shared/ReportModal';

interface HistoryDetailModalProps {
  record: HydratedPrediction;
  onClose: () => void;
  onDelete: (id: string) => void;
  translateSymptoms: (s: string) => string[];
}

export default function HistoryDetailModal({ record, onClose, onDelete, translateSymptoms }: HistoryDetailModalProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { downloadPDF } = useDownloadPDF();
  const [activePossibility, setActivePossibility] = useState<DiagnosisPossibility | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const allPossibilities =
    record.allPossibilities?.length > 0
      ? record.allPossibilities
      : [{ title: record.title, description: record.description, confidence: record.confidence, specialist: record.specialist, isPrimary: true }];

  const activePoss = activePossibility ?? allPossibilities[0];
  const styles = getConfidenceStyles(activePoss.confidence);
  const translatedSyms = translateSymptoms(record.symptoms);

  const isLowConfidence = activePoss.confidence < 50;
  const isFr = i18n.language.startsWith('fr');
  const generalistLabel = isFr ? 'Médecin Généraliste' : 'General Practitioner';
  const recommendedSpecialist = isLowConfidence ? generalistLabel : activePoss.specialist;

  const handleFindDoctor = () => {
    onClose();
    navigate('/dashboard/evaluation', {
      state: { openSpecialistFinder: true, specialist: recommendedSpecialist },
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-3xl shrink-0">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('dashboard.pages.historique.details_modal_title', "Détails de l'évaluation")}
                </h2>
                <p className="text-xs text-slate-400 font-semibold">
                  {t('dashboard.pages.historique.details_modal_date', { date: record.date, defaultValue: 'Effectuée le {{date}}' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => downloadPDF(record.id)} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-slate-700 dark:text-slate-200">
                <Download className="h-4 w-4" />
                <span>{t('dashboard.pages.evaluation.result_pdf', 'PDF')}</span>
              </button>
              <button onClick={() => setIsReportOpen(true)} className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-250 dark:border-amber-900/55 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span>{t('dashboard.pages.evaluation.report_issue', 'Signaler')}</span>
              </button>
              <button onClick={() => onDelete(record.id)} className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-red-700 dark:text-red-400">
                <Trash2 className="h-4 w-4" />
                <span>{t('common.delete', 'Supprimer')}</span>
              </button>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Red flag banner */}
            {record.alert && (
              <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/40 rounded-2xl p-5 flex gap-4 text-red-800 dark:text-red-300 shadow-md">
                <AlertTriangle className="h-7 w-7 shrink-0 text-red-650 dark:text-red-500 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold tracking-wide text-red-750 dark:text-red-400 uppercase">
                    {t('dashboard.pages.evaluation.result_safety_alerts_title', 'ALERTES DE SÉCURITÉ')}
                  </h4>
                  <p className="text-sm font-semibold leading-relaxed">
                    • {t('dashboard.pages.evaluation.result_red_flag_desc', "Signal d'alerte (Red flag) détecté - consultation urgente recommandée.")}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Diagnosis + alternatives */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-400 uppercase tracking-wider">
                      <CheckCircle className="h-4 w-4" />
                      {activePoss.isPrimary
                        ? t('dashboard.pages.evaluation.result_main_title', 'Résultat principal')
                        : t('dashboard.pages.evaluation.result_alternative_badge', 'Autre possibilité')}
                    </div>
                    <div className={`font-bold px-3 py-1 rounded-full text-xs border ${styles.badge}`}>
                      {activePoss.confidence}% {t('dashboard.home.recent_evaluations.confidence', 'Confiance')}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{activePoss.title}</h3>
                    {activePoss.description && (
                      <p className="text-slate-650 dark:text-slate-300 text-sm leading-relaxed font-medium">{activePoss.description}</p>
                    )}
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span>{t('dashboard.pages.evaluation.result_probability', 'Probabilité')}</span>
                      <span className={styles.text}>{activePoss.confidence}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${styles.bar}`} style={{ width: `${activePoss.confidence}%` }} />
                    </div>
                  </div>
                </div>

                {allPossibilities.length > 1 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {t('dashboard.pages.evaluation.result_alternatives_title', 'Autres possibilités analysées')}
                    </h4>
                    <div className="space-y-3">
                      {allPossibilities
                        .filter((p) => p.title !== activePoss.title)
                        .sort((a, b) => b.confidence - a.confidence)
                        .map((alt, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActivePossibility(alt)}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer"
                          >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{alt.title}</span>
                            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg border ${getConfidenceStyles(alt.confidence).badge}`}>
                              {alt.confidence}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Symptoms + Specialist */}
              <div className="space-y-6">
                {translatedSyms.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {t('dashboard.pages.evaluation.symptoms_declared_title', 'Symptômes déclarés')}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        {t('dashboard.pages.evaluation.symptoms_declared_desc', 'Symptômes analysés pour cette évaluation')}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {translatedSyms.map((sym, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {t('dashboard.pages.evaluation.result_specialist_recommended', 'Spécialiste recommandé')}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {t('dashboard.pages.evaluation.result_specialist_confirm', 'Pour confirmer ce résultat')}
                    </p>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-center space-y-1 shadow-inner">
                    <span className="text-lg font-extrabold text-white block">{recommendedSpecialist}</span>
                    {isLowConfidence ? (
                      <span className="text-[10px] text-slate-400 font-semibold block leading-relaxed mt-2">
                        {isFr
                          ? `Suggéré par l'IA : ${activePoss.specialist} (Indice : ${activePoss.specialistConfidence ?? 0}%)`
                          : `Suggested by AI: ${activePoss.specialist} (Index: ${activePoss.specialistConfidence ?? 0}%)`}
                        <br />
                        <span className="text-[9px] text-amber-400 font-bold tracking-wide uppercase">
                          {isFr ? '(Recommandé en premier recours — confiance < 50%)' : '(First line — confidence < 50%)'}
                        </span>
                      </span>
                    ) : (
                      activePoss.specialistConfidence != null && activePoss.specialistConfidence > 0 && (
                        <span className="text-xs text-slate-400 font-semibold block">
                          {t('dashboard.pages.evaluation.specialist_confidence', { confidence: activePoss.specialistConfidence, defaultValue: 'Indice de recommandation : {{confidence}}%' })}
                        </span>
                      )
                    )}
                  </div>

                  <button
                    onClick={handleFindDoctor}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-3 rounded-xl transition-colors shadow-sm cursor-pointer text-xs"
                  >
                    <MapPin className="h-4 w-4 fill-slate-950" />
                    <span>{t('dashboard.pages.evaluation.result_find_nearby', 'Trouver à proximité')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Legal warning */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/60 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold">{t('dashboard.pages.evaluation.result_warning_title', 'Avertissement important :')}</h5>
                <p className="text-[10px] leading-relaxed font-semibold">
                  {t('dashboard.pages.evaluation.result_warning_desc', "DiagnoCare est un outil d'aide à la décision et ne remplace pas un avis médical professionnel.")}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl flex justify-end shrink-0">
            <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-md">
              {t('common.close', 'Fermer')}
            </button>
          </div>
        </div>
      </div>

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} predId={Number(record.id)} />
    </>
  );
}
