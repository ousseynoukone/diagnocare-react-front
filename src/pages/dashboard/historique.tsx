import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, AlertTriangle, Calendar, ChevronLeft, ChevronRight, X, Download, CheckCircle, MapPin, Activity, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '../../store/UserStore';
import { useDetailedPredictions, useDeletePrediction, useDeleteAllPredictions } from '../../hooks/usePredictions';
import { useCreateReport } from '../../hooks/useReports';
import { useMLSymptomsMetadata } from '../../hooks/useSymptoms';
import { apiClient } from '../../api-s/AxiosApiClient';
import type { HydratedPrediction } from '../../types/models/Prediction';
import type { DiagnosisPossibility } from '../../types/models/Evaluation';
import HistoryItem from '../../components/dashboard/history/HistoryItem';

export default function HistoriquePage() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'red_flags' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<HydratedPrediction | null>(null);
  const [activeHistoryPossibility, setActiveHistoryPossibility] = useState<DiagnosisPossibility | null>(null);
  const [isClearHistoryOpen, setIsClearHistoryOpen] = useState(false);
  const [clearHistoryConfirmText, setClearHistoryConfirmText] = useState('');
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportPredId, setReportPredId] = useState<number | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportComment, setReportComment] = useState('');

  const itemsPerPage = 4;

  const user = useUserStore((state) => state.user);
  const { data: records = [], isLoading } = useDetailedPredictions(user?.id);
  const { data: mlMetadata } = useMLSymptomsMetadata();

  const deletePredictionMutation = useDeletePrediction();
  const deleteAllPredictionsMutation = useDeleteAllPredictions();

  const handleDeleteItem = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteItemOpen(true);
  };

  const handleConfirmDeleteItem = async () => {
    if (!deleteTargetId) return;
    try {
      await deletePredictionMutation.mutateAsync(Number(deleteTargetId));
      toast.success(t('dashboard.pages.historique.delete_success', 'Évaluation supprimée avec succès.'));
      if (selectedRecord?.id === deleteTargetId) {
        setSelectedRecord(null);
      }
    } catch (error) {
      toast.error(t('dashboard.pages.historique.delete_error', 'Une erreur est survenue lors de la suppression.'));
    } finally {
      setIsDeleteItemOpen(false);
      setDeleteTargetId(null);
    }
  };

  const triggerClearHistory = () => {
    setIsClearHistoryOpen(true);
    setClearHistoryConfirmText('');
  };

  const handleClearHistory = async () => {
    if (clearHistoryConfirmText !== 'ElPsyKongroo') return;
    if (!user?.id) return;

    try {
      await deleteAllPredictionsMutation.mutateAsync(user.id);
      toast.success(t('dashboard.pages.historique.clear_success', 'Historique vidé avec succès.'));
      setSelectedRecord(null);
      setIsClearHistoryOpen(false);
    } catch (error) {
      toast.error(t('dashboard.pages.historique.clear_error', 'Une erreur est survenue lors de la suppression.'));
    }
  };

  const createReportMutation = useCreateReport();

  const handleOpenReport = (predId: number) => {
    setReportPredId(predId);
    setReportTitle('');
    setReportComment('');
    setIsReportOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!user?.id || !reportPredId) return;
    if (!reportTitle.trim() || !reportComment.trim()) {
      toast.error(t('dashboard.pages.evaluation.report_fields_required', 'Veuillez remplir le titre et le commentaire.'));
      return;
    }

    try {
      await createReportMutation.mutateAsync({
        userId: user.id,
        predictionId: reportPredId,
        title: reportTitle,
        comment: reportComment,
      });
      toast.success(t('dashboard.pages.evaluation.report_success', 'Signalement envoyé avec succès.'));
      setIsReportOpen(false);
    } catch (error) {
      toast.error(t('dashboard.pages.evaluation.report_error', 'Erreur lors de l\'envoi du signalement.'));
    }
  };

  const handleDownloadPDF = async (predId: string) => {
    const toastId = toast.loading(t('auth.verify_email.success_code_sent') ? "Génération du rapport PDF en cours..." : "Generating PDF report...");
    try {
      const response = await apiClient.get(`/consultation-summaries/${predId}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `consultation-summary-${predId}.pdf`);
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

  const getConfidenceStyles = (score: number) => {
    if (score >= 70) {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bar: 'bg-emerald-500 dark:bg-emerald-400',
        badge: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50'
      };
    } else if (score >= 40) {
      return {
        text: 'text-amber-650 dark:text-amber-400',
        bar: 'bg-amber-500 dark:bg-amber-400',
        badge: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50'
      };
    } else {
      return {
        text: 'text-indigo-600 dark:text-indigo-450',
        bar: 'bg-indigo-500 dark:bg-indigo-400',
        badge: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50'
      };
    }
  };

  const translateSymptoms = (symptomsStr: string): string[] => {
    if (!symptomsStr) return [];
    const isFr = i18n.language.startsWith('fr');
    return symptomsStr.split(', ').map(item => {
      const trimmed = item.trim();
      if (!mlMetadata?.symptoms?.en) return trimmed;
      const foundEn = mlMetadata.symptoms.en.find(s => s.label === trimmed || s.id === trimmed);
      if (foundEn) {
        const foundFr = mlMetadata.symptoms.fr?.find(s => s.id === foundEn.id);
        return isFr ? (foundFr?.label || foundEn.label) : foundEn.label;
      }
      return trimmed;
    });
  };

  // Filtering records dynamically — must be before any early return (Rules of Hooks)
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const queryMatch =
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.specialist.toLowerCase().includes(searchQuery.toLowerCase());

      if (!queryMatch) return false;

      if (filter === 'red_flags') return rec.alert;
      if (filter === 'month') return rec.monthFilter;
      return true;
    });
  }, [searchQuery, filter, records]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const currentRecords = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, activePage]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px] max-w-7xl mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-primary"></div>
      </div>
    );
  }


  return (
    <div id="historique-page" className="h-full flex flex-col min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Main Title Description */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t('dashboard.pages.historique.title', 'Historique des prédictions')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('dashboard.pages.historique.description', 'Retrouvez toutes vos anciennes analyses.')}
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 w-full md:w-80">
          <Search className="h-5 w-5 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
            placeholder={t('dashboard.pages.historique.search_placeholder', 'Rechercher...')}
            className="w-full bg-transparent border-none text-sm font-semibold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
          />
        </div>

        {/* Action filter pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentPage(1);
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-750 dark:text-white border border-slate-900 dark:border-slate-650 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-650 dark:text-slate-350 border border-transparent dark:border-slate-800'
            }`}
          >
            {t('dashboard.pages.historique.filter_all', 'Tout voir')}
          </button>

          <button
            onClick={() => {
              setFilter('red_flags');
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
              filter === 'red_flags'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-650 dark:text-slate-350 border border-transparent dark:border-slate-800'
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-red-550 dark:text-red-400" />
            <span>{t('dashboard.pages.historique.filter_red_flags', 'Red Flags')}</span>
          </button>

          <button
            onClick={() => {
              setFilter('month');
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
              filter === 'month'
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-450 border border-blue-200 dark:border-blue-900/60 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-650 dark:text-slate-350 border border-transparent dark:border-slate-800'
            }`}
          >
            <Calendar className="h-4 w-4 text-blue-550 dark:text-blue-400" />
            <span>{t('dashboard.pages.historique.filter_month', 'Ce mois')}</span>
          </button>

          {records.length > 0 && (
            <button
              onClick={triggerClearHistory}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 shadow-sm"
              title={t('dashboard.pages.historique.clear_all_desc', 'Effacer tout l\'historique')}
            >
              <Trash2 className="h-4 w-4" />
              <span>{t('dashboard.pages.historique.clear_all', 'Vider l\'historique')}</span>
            </button>
          )}
        </div>
      </div>

      {/* History Items list */}
      <div className="space-y-4">
        {currentRecords.length > 0 ? (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {currentRecords.map((rec) => (
              <HistoryItem
                key={rec.id}
                title={rec.title}
                specialist={rec.specialist}
                date={rec.date}
                confidence={rec.confidence}
                alert={rec.alert}
                onViewDetails={() => {
                  setSelectedRecord(rec);
                  setActiveHistoryPossibility(null);
                }}
                onDelete={() => handleDeleteItem(rec.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center py-16 space-y-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full text-slate-400">
              <Search className="h-12 w-12 stroke-[1.5]" />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                {t('dashboard.pages.historique.card_title', 'Aucune évaluation enregistrée')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('dashboard.pages.historique.card_desc', 'Votre historique est vide pour le moment. Réalisez votre première évaluation pour l\'enregistrer ici.')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {filteredRecords.length > itemsPerPage && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={activePage === 1}
            className={`inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors text-sm ${
              activePage === 1
                ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-950'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{t('dashboard.pages.historique.prev_button', 'Précédent')}</span>
          </button>

          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 select-none">
            {t('dashboard.pages.historique.page_info', { current: activePage, total: totalPages })}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={activePage === totalPages}
            className={`inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors text-sm ${
              activePage === totalPages
                ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-950'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'
            }`}
          >
            <span>{t('dashboard.pages.historique.next_button', 'Suivant')}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Detail Modal Overlay */}
      {selectedRecord && (() => {
        const allPossibilities = selectedRecord.allPossibilities && selectedRecord.allPossibilities.length > 0
          ? selectedRecord.allPossibilities
          : [
              {
                title: selectedRecord.title,
                description: selectedRecord.description,
                confidence: selectedRecord.confidence,
                specialist: selectedRecord.specialist,
                isPrimary: true
              }
            ];

        const activePoss = activeHistoryPossibility || allPossibilities[0];
        const styles = getConfidenceStyles(activePoss.confidence);
        const translatedSyms = translateSymptoms(selectedRecord.symptoms);
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-3xl shrink-0">
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {t('dashboard.pages.historique.details_modal_title', "Détails de l'évaluation")}
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                      {t('dashboard.pages.historique.details_modal_date', { date: selectedRecord.date, defaultValue: 'Effectuée le {{date}}' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownloadPDF(selectedRecord.id)}
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <Download className="h-4 w-4" />
                    <span>{t('dashboard.pages.evaluation.result_pdf', 'PDF')}</span>
                  </button>

                  <button 
                    onClick={() => handleOpenReport(Number(selectedRecord.id))}
                    className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-250 dark:border-amber-900/55 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-amber-700 dark:text-amber-400"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>{t('dashboard.pages.evaluation.report_issue', 'Signaler')}</span>
                  </button>

                  <button 
                    onClick={() => handleDeleteItem(selectedRecord.id)}
                    className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{t('common.delete', 'Supprimer')}</span>
                  </button>

                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Urgent Red Flag Alert Banner */}
                {selectedRecord.alert && (
                  <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/40 rounded-2xl p-5 flex gap-4 text-red-800 dark:text-red-300 shadow-md">
                    <AlertTriangle className="h-7 w-7 shrink-0 text-red-650 dark:text-red-500 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold tracking-wide text-red-750 dark:text-red-400 uppercase">
                        {t('dashboard.pages.evaluation.result_safety_alerts_title', 'ALERTES DE SÉCURITÉ')}
                      </h4>
                      <p className="text-sm font-semibold leading-relaxed">
                        • {t('dashboard.pages.evaluation.result_red_flag_desc', 'Signal d\'alerte (Red flag) détecté - consultation urgente recommandée.')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Primary/Alternatives & Symptoms/Specialist Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left grid section (Diagnosis / Alternatives) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Primary Pathology Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                      <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="space-y-0.5">
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-400 uppercase tracking-wider">
                            <CheckCircle className="h-4 w-4" />
                            {activePoss.isPrimary
                              ? t('dashboard.pages.evaluation.result_main_title', 'Résultat principal')
                              : t('dashboard.pages.evaluation.result_alternative_badge', 'Autre possibilité')
                            }
                          </div>
                        </div>
                        <div className={`font-bold px-3 py-1 rounded-full text-xs border ${styles.badge}`}>
                          {activePoss.confidence}% {t('dashboard.home.recent_evaluations.confidence', 'Confiance')}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {activePoss.title}
                        </h3>
                        {activePoss.description && (
                          <p className="text-slate-650 dark:text-slate-300 text-sm leading-relaxed font-medium">
                            {activePoss.description}
                          </p>
                        )}
                      </div>

                      {/* Confidence Meter */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                          <span>{t('dashboard.pages.evaluation.result_probability', 'Probabilité')}</span>
                          <span className={styles.text}>{activePoss.confidence}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${styles.bar}`} 
                            style={{ width: `${activePoss.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Alternatives Card */}
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
                                onClick={() => setActiveHistoryPossibility(alt)}
                                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 hover:border-slate-250 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer"
                              >
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {alt.title}
                                </span>
                                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg border ${
                                  alt.confidence >= 70 
                                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/50'
                                    : alt.confidence >= 40
                                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 border-amber-250/50 dark:border-amber-800/50'
                                      : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-250/50 dark:border-indigo-800/50'
                                }`}>
                                  {alt.confidence}%
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right grid section (Symptoms / Specialist) */}
                  <div className="space-y-6">
                    {/* Declared Symptoms */}
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
                            <span 
                              key={idx}
                              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 shadow-xs"
                            >
                              {sym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Specialist */}
                    <div className="bg-slate-900 text-white border border-slate-800 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {t('dashboard.pages.evaluation.result_specialist_recommended', 'Spécialiste recommandé')}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          {t('dashboard.pages.evaluation.result_specialist_confirm', 'Pour confirmer ce résultat')}
                        </p>
                      </div>
                      
                      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-center space-y-1 shadow-inner">
                        <span className="text-lg font-extrabold text-white block">
                          {activePoss.specialist}
                        </span>
                      </div>

                      <a
                        href={`https://www.doctolib.fr/recherche?query=${encodeURIComponent(activePoss.specialist)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-3 rounded-xl transition-colors shadow-sm cursor-pointer text-xs"
                      >
                        <MapPin className="h-4 w-4 fill-slate-950" />
                        <span>{t('dashboard.pages.evaluation.result_find_nearby', 'Trouver à proximité')}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Legal warning banner */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/60 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold">{t('dashboard.pages.evaluation.result_warning_title', 'Avertissement important :')}</h5>
                    <p className="text-[10px] leading-relaxed font-semibold">
                      {t('dashboard.pages.evaluation.result_warning_desc', "DiagnoCare est un outil d'aide à la décision et ne remplace pas un avis médical professionnel. Ceci n'est pas un diagnostic médical. En cas d'urgence, contactez immédiatement le 15 ou rendez-vous aux urgences.")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-md"
                >
                  {t('common.close', 'Fermer')}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Clear History Confirmation Modal */}
      {isClearHistoryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-6 animate-scaleIn">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-red-50 dark:bg-red-950/40 p-3.5 rounded-full text-red-600 dark:text-red-400">
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('dashboard.pages.historique.clear_confirm_title', 'Confirmer la suppression')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('dashboard.pages.historique.clear_confirm_desc', 'Cette action est irréversible et supprimera tout votre historique de prédictions.')}
              </p>
              <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block mb-1">
                  {t('dashboard.pages.historique.clear_confirm_type_code', 'Veuillez saisir le code de confirmation :')}
                </span>
                <code className="text-base font-extrabold tracking-widest text-slate-900 dark:text-white select-all">
                  ElPsyKongroo
                </code>
              </div>
              <input
                type="text"
                value={clearHistoryConfirmText}
                onChange={(e) => setClearHistoryConfirmText(e.target.value)}
                placeholder="ElPsyKongroo"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-550/50 focus:border-red-500 placeholder-slate-400 transition-all"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsClearHistoryOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleClearHistory}
                disabled={clearHistoryConfirmText !== 'ElPsyKongroo'}
                className={`flex-1 font-bold py-3 rounded-xl text-sm transition-all cursor-pointer text-white ${
                  clearHistoryConfirmText === 'ElPsyKongroo'
                    ? 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                {t('common.confirm', 'Confirmer')}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Delete Single Prediction Confirmation Modal */}
      {isDeleteItemOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-6 animate-scaleIn">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-red-50 dark:bg-red-950/40 p-3.5 rounded-full text-red-600 dark:text-red-400">
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('dashboard.pages.historique.delete_confirm_title', 'Supprimer cette évaluation ?')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('dashboard.pages.historique.delete_confirm_desc', 'Cette évaluation sera supprimée de votre historique. Cette action est irréversible.')}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setIsDeleteItemOpen(false); setDeleteTargetId(null); }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleConfirmDeleteItem}
                disabled={deletePredictionMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-red-500/20"
              >
                {deletePredictionMutation.isPending
                  ? t('common.deleting', 'Suppression...')
                  : t('common.delete', 'Supprimer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
