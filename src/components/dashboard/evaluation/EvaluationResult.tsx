import { useState, useEffect } from 'react';
import { ArrowLeft, Download, CheckCircle, MapPin, AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { PredictionResult, DiagnosisPossibility } from '../../../types/models/Evaluation';
import { apiClient } from '../../../api-s/AxiosApiClient';
import { useCreateReport } from '../../../hooks/useReports';
import { useUserStore } from '../../../store/UserStore';

const getConfidenceStyles = (score: number) => {
  if (score >= 70) {
    return {
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-500 dark:bg-emerald-400',
      badge: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-250 dark:border-emerald-900/50'
    };
  } else if (score >= 40) {
    return {
      text: 'text-amber-650 dark:text-amber-400',
      bar: 'bg-amber-500 dark:bg-amber-400',
      badge: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-250 dark:border-amber-900/50'
    };
  } else {
    return {
      text: 'text-indigo-600 dark:text-indigo-450',
      bar: 'bg-indigo-500 dark:bg-indigo-400',
      badge: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-250 dark:border-indigo-900/50'
    };
  }
};

interface EvaluationResultProps {
  resultData: PredictionResult;
  onBackToSelection: () => void;
  onFindSpecialists: (specialistName: string) => void;
}

export default function EvaluationResult({
  resultData,
  onBackToSelection,
  onFindSpecialists,
}: EvaluationResultProps) {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const createReportMutation = useCreateReport();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportComment, setReportComment] = useState('');

  const handleOpenReport = () => {
    setReportTitle('');
    setReportComment('');
    setIsReportOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!user?.id || !resultData.id) return;
    if (!reportTitle.trim() || !reportComment.trim()) {
      toast.error(t('dashboard.pages.evaluation.report_fields_required', 'Veuillez remplir le titre et le commentaire.'));
      return;
    }

    try {
      await createReportMutation.mutateAsync({
        userId: user.id,
        predictionId: resultData.id,
        title: reportTitle,
        comment: reportComment,
      });
      toast.success(t('dashboard.pages.evaluation.report_success', 'Signalement envoyé avec succès.'));
      setIsReportOpen(false);
    } catch (error) {
      toast.error(t('dashboard.pages.evaluation.report_error', 'Erreur lors de l\'envoi du signalement.'));
    }
  };

  const allPossibilities = resultData.allPossibilities || [
    {
      title: resultData.title,
      description: resultData.description,
      confidence: resultData.confidence,
      specialist: resultData.specialist,
      specialistConfidence: resultData.specialistConfidence,
      isPrimary: true
    }
  ];

  const [activePossibility, setActivePossibility] = useState<DiagnosisPossibility>(allPossibilities[0]);

  useEffect(() => {
    const freshPossibilities = resultData.allPossibilities || [
      {
        title: resultData.title,
        description: resultData.description,
        confidence: resultData.confidence,
        specialist: resultData.specialist,
        specialistConfidence: resultData.specialistConfidence,
        isPrimary: true
      }
    ];
    setActivePossibility(freshPossibilities[0]);
  }, [resultData]);

  const styles = getConfidenceStyles(activePossibility.confidence);

  const handleDownloadPDF = async () => {
    if (!resultData.id) {
      toast.error(t('auth.verify_email.success_code_sent') ? "Impossible de générer le PDF : ID manquant." : "Cannot generate PDF: Missing ID.");
      return;
    }
    const toastId = toast.loading(t('auth.verify_email.success_code_sent') ? "Génération du rapport PDF en cours..." : "Generating PDF report...");
    try {
      const response = await apiClient.get(`/consultation-summaries/${resultData.id}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `consultation-summary-${resultData.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t('auth.verify_email.success_code_sent') ? "Rapport PDF téléchargé avec succès !" : "PDF report downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error(t('auth.verify_email.success_code_sent') ? "Erreur lors de la génération du PDF." : "Error generating PDF report.", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onBackToSelection}
          className="inline-flex items-center gap-2 text-sm font-semibold text-background-500 hover:text-background-900 dark:text-background-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('dashboard.pages.evaluation.result_back', 'Retour')}
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 hover:bg-background-50 dark:hover:bg-background-800 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer text-background-700 dark:text-background-200"
          >
            <Download className="h-4 w-4 text-background-500" />
            {t('dashboard.pages.evaluation.result_pdf', 'PDF')}
          </button>

          <button 
            onClick={handleOpenReport}
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-250 hover:border-amber-300 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 dark:border-amber-900/50 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer text-amber-700 dark:text-amber-400"
          >
            <AlertTriangle className="h-4 w-4" />
            {t('dashboard.pages.evaluation.report_issue', 'Signaler')}
          </button>
        </div>
      </div>

      {/* Safety Alert (Red Flag) Banner if urgent */}
      {resultData.urgent && (
        <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/40 rounded-2xl p-5 flex gap-4 text-red-800 dark:text-red-300 shadow-md shadow-red-500/5">
          <AlertTriangle className="h-7 w-7 shrink-0 text-red-650 dark:text-red-500 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-base font-extrabold tracking-wide text-red-700 dark:text-red-400 uppercase">
              {t('dashboard.pages.evaluation.result_safety_alerts_title', 'ALERTES DE SÉCURITÉ')}
            </h4>
            <p className="text-sm font-semibold leading-relaxed">
              • {t('dashboard.pages.evaluation.result_red_flag_desc', 'Signal d\'alerte (Red flag) détecté - consultation urgente recommandée.')}
            </p>
          </div>
        </div>
      )}

      {/* Results Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Main Diagnosis & alternatives */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl p-6 md:p-8 shadow-sm">
            
            {/* Result Tag Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-background-100 dark:border-background-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary dark:text-primary-400 uppercase tracking-widest">
                  <CheckCircle className="h-4 w-4" />
                  {activePossibility.isPrimary
                    ? t('dashboard.pages.evaluation.result_main_title', 'Résultat principal')
                    : t('dashboard.pages.evaluation.result_alternative_badge', 'Autre possibilité')
                  }
                </div>
                <p className="text-xs text-background-400 dark:text-background-500 font-semibold">
                  {t('dashboard.pages.evaluation.result_based_on', 'Basé sur vos symptômes déclarés')}
                </p>
              </div>
              
              <div className={`font-bold px-3 py-1.5 rounded-full text-xs border ${styles.badge}`}>
                {t('dashboard.pages.evaluation.result_confidence', { confidence: activePossibility.confidence, defaultValue: 'Confiance {{confidence}}%' })}
              </div>
            </div>

            {/* Primary Disease Title */}
            <div className="py-6 space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-background-900 dark:text-white tracking-tight">
                {activePossibility.title}
              </h2>
              <p className="text-background-600 dark:text-background-300 text-base leading-relaxed font-medium">
                {activePossibility.description}
              </p>
            </div>

            {/* Probability Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-background-500 dark:text-background-400">{t('dashboard.pages.evaluation.result_probability', 'Probabilité')}</span>
                <span className={`font-bold ${styles.text}`}>{activePossibility.confidence}%</span>
              </div>
              <div className="h-3 w-full bg-background-100 dark:bg-background-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${styles.bar}`} 
                  style={{ width: `${activePossibility.confidence}%` }}
                />
              </div>
            </div>

          </div>

          {/* Other possibilities list */}
          <div className="bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-background-900 dark:text-white">
              {t('dashboard.pages.evaluation.result_alternatives_title', 'Autres possibilités analysées')}
            </h3>
            <div className="space-y-4">
              {allPossibilities
                .filter((p) => p.title !== activePossibility.title)
                .sort((a, b) => b.confidence - a.confidence)
                .map((alt, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActivePossibility(alt)}
                    className="flex items-center justify-between p-4 rounded-xl bg-background-50 dark:bg-background-900/40 border border-background-100 dark:border-background-800/60 hover:bg-background-100/60 dark:hover:bg-background-900/50 hover:border-background-250 dark:hover:border-background-700 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-background-800 dark:text-background-200">
                      {alt.title}
                    </span>
                    <span className={`text-sm font-extrabold px-3 py-1 rounded-lg border shadow-xs ${
                      alt.confidence >= 70 
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/60'
                        : alt.confidence >= 40
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/60'
                          : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-800/60'
                    }`}>
                      {alt.confidence}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Specialist & Medical Profile used */}
        <div className="space-y-6">
          {/* Recommended Specialist Card */}
          <div className="bg-background-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-background-800 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-background-400 uppercase tracking-widest">
                {t('dashboard.pages.evaluation.result_specialist_recommended', 'Spécialiste recommandé')}
              </h3>
              <p className="text-xs text-background-500">
                {t('dashboard.pages.evaluation.result_specialist_confirm', 'Pour confirmer ce résultat')}
              </p>
            </div>
            
            {/* Doctor badge box */}
            <div className="bg-background-800 border border-background-700 p-5 rounded-xl text-center shadow-inner space-y-1">
              <span className="text-xl font-extrabold tracking-tight text-white block">
                {activePossibility.specialist}
              </span>
              {activePossibility.specialistConfidence !== undefined && activePossibility.specialistConfidence > 0 && (
                <span className="text-xs text-background-400 font-semibold block">
                  {t('dashboard.pages.evaluation.specialist_confidence', { confidence: activePossibility.specialistConfidence, defaultValue: 'Indice de recommandation : {{confidence}}%' })}
                </span>
              )}
            </div>

            <div className="space-y-4 pt-6">
              <button
                onClick={() => onFindSpecialists(activePossibility.specialist)}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-background-100 text-background-900 font-bold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg cursor-pointer"
              >
                <MapPin className="h-4 w-4 fill-background-950" />
                {t('dashboard.pages.evaluation.result_find_nearby', 'Trouver à proximité')}
              </button>
              <p className="text-center text-[10px] text-background-500 font-semibold tracking-wide">
                {t('dashboard.pages.evaluation.result_redirection_sub', 'Redirection vers Doctolib / Google Maps')}
              </p>
            </div>
          </div>

          {/* Declared Symptoms Card */}
          {resultData.symptoms && resultData.symptoms.length > 0 && (
            <div className="bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-background-900 dark:text-white uppercase tracking-wider">
                  {t('dashboard.pages.evaluation.symptoms_declared_title', 'Symptômes déclarés')}
                </h3>
                <p className="text-xs text-background-400 dark:text-background-500 font-semibold">
                  {t('dashboard.pages.evaluation.symptoms_declared_desc', 'Symptômes analysés pour cette évaluation')}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {resultData.symptoms.map((symptom, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 transition-all duration-200 shadow-xs"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Factored Profile Card */}
          {resultData.profileUsed && Object.keys(resultData.profileUsed).length > 0 && (
            <div className="bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-background-900 dark:text-white uppercase tracking-wider">
                  {t('dashboard.pages.evaluation.profile_factored_title', 'Profil médical pris en compte')}
                </h3>
                <p className="text-xs text-background-400 dark:text-background-500 font-semibold">
                  {t('dashboard.pages.evaluation.profile_factored_desc', 'Facteurs démographiques et indicateurs cliniques')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-background-600 dark:text-background-400">
                {Object.entries(resultData.profileUsed).map(([key, val]) => {
                  // Skip Outcome Variable, not relevant for the patient
                  if (key === 'Outcome Variable') return null;
                  
                  // Simple translation mapping for keys
                  const keyMap: Record<string, string> = {
                    'Age': 'Âge',
                    'Weight': 'Poids',
                    'BMI': 'IMC (BMI)',
                    'Tension_Moyenne': 'Tension moyenne',
                    'Cholesterole_Moyen': 'Cholestérol moyen',
                    'Gender': 'Sexe',
                    'Blood Pressure': 'Tension artérielle',
                    'Cholesterol Level': 'Niveau de cholestérol',
                    'Smoking': 'Tabac',
                    'Alcohol': 'Alcool',
                    'Sedentarite': 'Sédentarité',
                    'Family_History': 'Antécédents familiaux'
                  };

                  // Simple translation mapping for values
                  const valMap: Record<string, string> = {
                    'Male': 'Homme',
                    'Female': 'Femme',
                    'Yes': 'Oui',
                    'No': 'Non',
                    'High': 'Élevé(e)',
                    'Normal': 'Normal(e)',
                    'Low': 'Faible',
                    'Moderate': 'Modéré(e)',
                    'None': 'Aucun(e)'
                  };

                  const displayKey = keyMap[key] || key;
                  let displayVal = valMap[val] || val;

                  // Format weight & BMI unit details nicely
                  if (key === 'Weight' && !isNaN(Number(val))) {
                    displayVal = `${Math.round(Number(val))} kg`;
                  } else if (key === 'BMI' && !isNaN(Number(val))) {
                    displayVal = `${Number(val).toFixed(1)}`;
                  } else if (key === 'Age' && !isNaN(Number(val))) {
                    displayVal = `${val} ans`;
                  }

                  return (
                    <div key={key} className="bg-background-50 dark:bg-background-900/40 p-2.5 rounded-xl border border-background-100 dark:border-background-800/40 flex flex-col gap-0.5 animate-fadeIn">
                      <span className="text-[10px] text-background-400 uppercase tracking-wider">{displayKey}</span>
                      <span className="text-sm font-extrabold text-background-850 dark:text-background-150">{displayVal}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Legal Warning Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/60 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-500" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold">{t('dashboard.pages.evaluation.result_warning_title', 'Avertissement important :')}</h4>
          <p className="text-xs leading-relaxed font-semibold">
            {t('dashboard.pages.evaluation.result_warning_desc', "DiagnoCare est un outil d'aide à la décision et ne remplace pas un avis médical professionnel. Ceci n'est pas un diagnostic médical. En cas d'urgence, contactez immédiatement le 15 ou rendez-vous aux urgences.")}
          </p>
        </div>
      </div>

      {/* Report Issue Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-6 animate-scaleIn">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('dashboard.pages.evaluation.report_modal_title', 'Signaler un problème')}
                </h3>
              </div>
              <button
                onClick={() => setIsReportOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider">
                  {t('dashboard.pages.evaluation.report_title_label', 'Titre de l\'anomalie')}
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder={t('dashboard.pages.evaluation.report_title_placeholder', 'Ex: Diagnostic incohérent, symptômes erronés...')}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-slate-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider">
                  {t('dashboard.pages.evaluation.report_comment_label', 'Commentaires')}
                </label>
                <textarea
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  rows={4}
                  placeholder={t('dashboard.pages.evaluation.report_comment_placeholder', 'Veuillez décrire en détail le problème rencontré pour nous aider à améliorer notre algorithme...')}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-slate-400 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsReportOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={createReportMutation.isPending || !reportTitle.trim() || !reportComment.trim()}
                className={`font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer text-white ${
                  !reportTitle.trim() || !reportComment.trim()
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50'
                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-750 dark:hover:bg-slate-700 shadow-md'
                }`}
              >
                {createReportMutation.isPending ? t('common.sending', 'Envoi...') : t('common.send', 'Envoyer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
