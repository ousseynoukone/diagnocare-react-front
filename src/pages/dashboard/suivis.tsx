import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getLocalFollowUps, completeLocalFollowUp } from '../../utils/storageHelper';
import FollowUpItem from '../../components/dashboard/followup/FollowUpItem';

export default function SuivisPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [followups, setFollowups] = useState(() => getLocalFollowUps());

  const pendingList = followups.filter((f) => f.status === 'pending');
  const completedList = followups.filter((f) => f.status === 'completed');

  const handleStartFollowUp = (id: string) => {
    toast.success(t('dashboard.pages.suivis.success_start', 'Suivi commencé avec succès !'));
    const updated = completeLocalFollowUp(id, t('dashboard.pages.suivis.completed_followup_status', 'Terminé'));
    setFollowups(updated);
  };

  const handleCreateFollowUp = () => {
    toast.info(t('dashboard.pages.suivis.create_info', 'Veuillez effectuer une nouvelle évaluation pour initier un suivi.'));
  };

  return (
    <div id="suivis-page" className="h-full flex flex-col min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header section with Title and CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t('dashboard.pages.suivis.title', 'Suivi de santé')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t('dashboard.pages.suivis.description', 'Gérez vos check-ins réguliers pour surveiller l\'évolution de vos symptômes.')}
          </p>
        </div>
        
        <button
          onClick={handleCreateFollowUp}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 active:bg-primary-800 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-200 cursor-pointer shrink-0"
        >
          <Clock className="h-4 w-4" />
          <span>{t('dashboard.pages.suivis.new_followup', 'Nouveau suivi')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex gap-8 -mb-px">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'border-primary text-primary dark:text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span>{t('dashboard.pages.suivis.tab_pending', 'En attente')}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {pendingList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'border-primary text-primary dark:text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span>{t('dashboard.pages.suivis.tab_completed', 'Terminés')}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold transition-all ${
                activeTab === 'completed'
                  ? 'bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {completedList.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'pending' ? (
          pendingList.length > 0 ? (
            <div className="flex flex-col gap-4 animate-fadeIn">
              {pendingList.map((item) => (
                <FollowUpItem
                  key={item.id}
                  title={item.title}
                  status={item.status}
                  statusLabel={item.statusLabel}
                  time={item.time}
                  day={item.day}
                  onAction={() => handleStartFollowUp(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center py-12 space-y-6">
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-full text-amber-600 dark:text-amber-400">
                <Clock className="h-12 w-12 stroke-[1.5]" />
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  {t('dashboard.pages.suivis.card_title', 'Aucun suivi actif')}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('dashboard.pages.suivis.card_desc', 'Vous n\'avez pas d\'évaluation récente nécessitant un suivi particulier. Les suivis s\'activent après une évaluation de symptômes.')}
                </p>
              </div>
            </div>
          )
        ) : (
          completedList.length > 0 ? (
            <div className="flex flex-col gap-4 animate-fadeIn">
              {completedList.map((item) => (
                <FollowUpItem
                  key={item.id}
                  title={item.title}
                  status={item.status}
                  statusLabel={item.statusLabel}
                  time={item.time}
                  day={item.day}
                  onAction={() => toast.info(t('dashboard.pages.suivis.completed_details', 'Détails du suivi déjà terminés.'))}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center py-12 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-full text-slate-400">
                <Clock className="h-12 w-12 stroke-[1.5]" />
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  {t('dashboard.pages.suivis.no_completed_title', 'Aucun suivi terminé')}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('dashboard.pages.suivis.no_completed_desc', 'Vos suivis terminés apparaîtront ici une fois complétés.')}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
        <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
          <Info className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
            {t('dashboard.pages.suivis.info_title', 'Pourquoi le suivi est important ?')}
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed max-w-4xl font-medium">
            {t('dashboard.pages.suivis.info_desc', 'Les symptômes évoluent rapidement. Un suivi régulier (toutes les 24h ou 48h) permet à notre IA de détecter précocement toute aggravation et d\'ajuster ses recommandations.')}
          </p>
        </div>
      </div>
    </div>
  );
}
