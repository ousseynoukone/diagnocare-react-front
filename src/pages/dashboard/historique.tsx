import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, AlertTriangle, Calendar, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '../../store/UserStore';
import { useDetailedPredictions, useDeletePrediction, useDeleteAllPredictions } from '../../hooks/usePredictions';
import { useMLSymptomsMetadata } from '../../hooks/useSymptoms';
import type { HydratedPrediction } from '../../types/models/Prediction';
import HistoryItem from '../../components/dashboard/history/HistoryItem';
import HistoryDetailModal from '../../components/dashboard/history/HistoryDetailModal';
import ClearHistoryModal from '../../components/dashboard/history/ClearHistoryModal';
import DeleteConfirmModal from '../../components/dashboard/history/DeleteConfirmModal';

const ITEMS_PER_PAGE = 4;

export default function HistoriquePage() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'red_flags' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<HydratedPrediction | null>(null);
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const user = useUserStore((s) => s.user);
  const { data: records = [], isLoading } = useDetailedPredictions(user?.id);
  const { data: mlMetadata } = useMLSymptomsMetadata();
  const deletePredictionMutation = useDeletePrediction();
  const deleteAllPredictionsMutation = useDeleteAllPredictions();

  const translateSymptoms = (symptomsStr: string): string[] => {
    if (!symptomsStr) return [];
    const isFr = i18n.language.startsWith('fr');
    return symptomsStr.split(', ').map((item) => {
      const trimmed = item.trim();
      if (!mlMetadata?.symptoms?.en) return trimmed;
      const foundEn = mlMetadata.symptoms.en.find((s) => s.label === trimmed || s.id === trimmed);
      if (foundEn) {
        const foundFr = mlMetadata.symptoms.fr?.find((s) => s.id === foundEn.id);
        return isFr ? foundFr?.label ?? foundEn.label : foundEn.label;
      }
      return trimmed;
    });
  };

  const handleDeleteItem = (id: string) => setDeleteTargetId(id);

  const handleConfirmDeleteItem = async () => {
    if (!deleteTargetId) return;
    try {
      await deletePredictionMutation.mutateAsync(Number(deleteTargetId));
      toast.success(t('dashboard.pages.historique.delete_success', 'Évaluation supprimée avec succès.'));
      if (selectedRecord?.id === deleteTargetId) setSelectedRecord(null);
    } catch {
      toast.error(t('dashboard.pages.historique.delete_error', 'Une erreur est survenue lors de la suppression.'));
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleClearHistory = async () => {
    if (!user?.id) return;
    try {
      await deleteAllPredictionsMutation.mutateAsync(user.id);
      toast.success(t('dashboard.pages.historique.clear_success', 'Historique vidé avec succès.'));
      setSelectedRecord(null);
      setIsClearOpen(false);
    } catch {
      toast.error(t('dashboard.pages.historique.clear_error', 'Une erreur est survenue lors de la suppression.'));
    }
  };

  const filteredRecords = useMemo(() => records.filter((rec) => {
    const match = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) || rec.specialist.toLowerCase().includes(searchQuery.toLowerCase());
    if (!match) return false;
    if (filter === 'red_flags') return rec.alert;
    if (filter === 'month') return rec.monthFilter;
    return true;
  }), [searchQuery, filter, records]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const currentRecords = useMemo(() => filteredRecords.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE), [filteredRecords, activePage]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px] max-w-7xl mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-primary" />
      </div>
    );
  }

  const filterBtnClass = (active: boolean) =>
    active
      ? 'bg-slate-900 text-white dark:bg-slate-750 dark:text-white border border-slate-900 dark:border-slate-650 shadow-md'
      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-650 dark:text-slate-350 border border-transparent dark:border-slate-800';

  return (
    <div className="h-full flex flex-col min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t('dashboard.pages.historique.title', 'Historique des prédictions')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('dashboard.pages.historique.description', 'Retrouvez toutes vos anciennes analyses.')}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 w-full md:w-80">
          <Search className="h-5 w-5 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder={t('dashboard.pages.historique.search_placeholder', 'Rechercher...')}
            className="w-full bg-transparent border-none text-sm font-semibold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <button onClick={() => { setFilter('all'); setCurrentPage(1); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${filterBtnClass(filter === 'all')}`}>
            {t('dashboard.pages.historique.filter_all', 'Tout voir')}
          </button>
          <button onClick={() => { setFilter('red_flags'); setCurrentPage(1); }} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${filter === 'red_flags' ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60 shadow-md' : filterBtnClass(false)}`}>
            <AlertTriangle className="h-4 w-4 text-red-550 dark:text-red-400" />
            <span>{t('dashboard.pages.historique.filter_red_flags', 'Red Flags')}</span>
          </button>
          <button onClick={() => { setFilter('month'); setCurrentPage(1); }} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${filter === 'month' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-450 border border-blue-200 dark:border-blue-900/60 shadow-md' : filterBtnClass(false)}`}>
            <Calendar className="h-4 w-4 text-blue-550 dark:text-blue-400" />
            <span>{t('dashboard.pages.historique.filter_month', 'Ce mois')}</span>
          </button>
          {records.length > 0 && (
            <button onClick={() => setIsClearOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 shadow-sm">
              <Trash2 className="h-4 w-4" />
              <span>{t('dashboard.pages.historique.clear_all', "Vider l'historique")}</span>
            </button>
          )}
        </div>
      </div>

      {/* List */}
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
                onViewDetails={() => setSelectedRecord(rec)}
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
                {t('dashboard.pages.historique.card_desc', "Votre historique est vide pour le moment. Réalisez votre première évaluation pour l'enregistrer ici.")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredRecords.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={activePage === 1} className={`inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors text-sm ${activePage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'}`}>
            <ChevronLeft className="h-4 w-4" />
            <span>{t('dashboard.pages.historique.prev_button', 'Précédent')}</span>
          </button>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 select-none">
            {t('dashboard.pages.historique.page_info', { current: activePage, total: totalPages })}
          </span>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={activePage === totalPages} className={`inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors text-sm ${activePage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'}`}>
            <span>{t('dashboard.pages.historique.next_button', 'Suivant')}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedRecord && (
        <HistoryDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onDelete={(id) => { handleDeleteItem(id); setSelectedRecord(null); }}
          translateSymptoms={translateSymptoms}
        />
      )}

      <ClearHistoryModal
        isOpen={isClearOpen}
        onClose={() => setIsClearOpen(false)}
        onConfirm={handleClearHistory}
        isPending={deleteAllPredictionsMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDeleteItem}
        isPending={deletePredictionMutation.isPending}
      />
    </div>
  );
}
