import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, AlertTriangle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '../../store/UserStore';
import { useDetailedPredictions } from '../../hooks/usePredictions';
import HistoryItem from '../../components/dashboard/history/HistoryItem';

export default function HistoriquePage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'red_flags' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const user = useUserStore((state) => state.user);
  const { data: records = [], isLoading } = useDetailedPredictions(user?.id);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px] max-w-7xl mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-primary"></div>
      </div>
    );
  }

  // Filtering records dynamically
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Search query match
      const queryMatch =
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.specialist.toLowerCase().includes(searchQuery.toLowerCase());

      if (!queryMatch) return false;

      // Filter category pills match
      if (filter === 'red_flags') return rec.alert;
      if (filter === 'month') return rec.monthFilter;
      return true;
    });
  }, [searchQuery, filter, records]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  
  // Adjust current page if filters shorten the list
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const currentRecords = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, activePage]);

  const handleViewDetails = (title: string) => {
    toast.info(t('dashboard.pages.historique.details_toast', { title }));
  };

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
                onViewDetails={() => handleViewDetails(rec.title)}
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
    </div>
  );
}
