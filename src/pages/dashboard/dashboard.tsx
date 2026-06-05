import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, Clock, Plus, Calendar } from 'lucide-react';
import { useUserStore } from '../../store/UserStore';
import { useDetailedPredictions } from '../../hooks/usePredictions';
import { useDetailedCheckIns } from '../../hooks/useCheckIns';
import StatsCard from '../../components/dashboard/StatsCard';
import AlertBanner from '../../components/dashboard/AlertBanner';
import ActionCard from '../../components/dashboard/ActionCard';
import EvaluationItem from '../../components/dashboard/evaluation/EvaluationItem';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const user = useUserStore((state) => state.user);
  
  // Connect to API using TanStack Query hooks
  const { data: records = [], isLoading: isHistoryLoading } = useDetailedPredictions(user?.id);
  const { data: followups = [], isLoading: isFollowUpsLoading } = useDetailedCheckIns(user?.id);

  const getFirstName = () => {
    return user?.firstName || 'Jean';
  };

  // Show a premium loading spinner while fetching data from the API
  if (isHistoryLoading || isFollowUpsLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px] max-w-7xl mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-primary"></div>
      </div>
    );
  }

  // Calculate evaluations created during the current month dynamically
  const monthlyCount = records.filter((r) => r.monthFilter).length;

  // Get active alerts count dynamically from history records
  const activeAlertsCount = records.filter((r) => r.alert).length;

  // Get next follow-up details dynamically
  const nextPendingFollowUp = followups.find((f) => f.status === 'pending');
  const nextFollowUpValue = nextPendingFollowUp ? '24h' : 'Aucun';
  const nextFollowUpSubtext = nextPendingFollowUp 
    ? nextPendingFollowUp.title 
    : t('dashboard.pages.suivis.card_title', 'Aucun suivi actif');

  // Display the 3 most recent evaluations from history
  const recentEvaluations = records.slice(0, 3);

  return (
    <div className="h-full flex flex-col min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Title & Subtitle + Last Update Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t('dashboard.home.title', 'Tableau de bord')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t('dashboard.home.subtitle', 'Bienvenue {{name}}, voici votre aperçu santé du jour.', { name: getFirstName() })}
          </p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          label={t('dashboard.home.stats.evaluations.label', 'Total évaluations')}
          value={records.length}
          trend={monthlyCount > 0 ? `+${monthlyCount}` : ''}
          subtext={monthlyCount > 0 ? t('dashboard.home.stats.evaluations.subtext', 'ce mois-ci') : `0 ${t('dashboard.home.stats.evaluations.subtext', 'ce mois-ci')}`}
          icon={FileText}
          iconBgClass="bg-blue-50 dark:bg-blue-950/40"
          iconColorClass="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          label={t('dashboard.home.stats.alerts.label', 'Alertes actives')}
          value={activeAlertsCount}
          trend={activeAlertsCount > 0 ? t('dashboard.home.stats.alerts.subtext', 'Action requise') : ''}
          trendColor="text-red-500 dark:text-red-400"
          subtext={activeAlertsCount === 0 ? t('dashboard.pages.suivis.completed_followup_status', 'Terminé') : ''}
          icon={AlertTriangle}
          iconBgClass="bg-red-50 dark:bg-red-950/40"
          iconColorClass="text-red-600 dark:text-red-400"
        />
        <StatsCard
          label={t('dashboard.home.stats.next_followup.label', 'Prochain suivi')}
          value={nextFollowUpValue}
          subtext={nextFollowUpSubtext}
          icon={Clock}
          iconBgClass="bg-amber-50 dark:bg-amber-950/40"
          iconColorClass="text-amber-500 dark:text-amber-400"
        />
      </div>

      {/* Emergency Warning Banner - Renders only if there are active warning/alert cases */}
      {activeAlertsCount > 0 && <AlertBanner />}

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          id="card-new-evaluation"
          variant="primary"
          title={t('dashboard.home.actions.new_evaluation.title', 'Nouvelle évaluation')}
          description={t('dashboard.home.actions.new_evaluation.description', 'Lancez une analyse complète de vos symptômes assistée par IA.')}
          icon={Plus}
          onClick={() => navigate('/dashboard/evaluation')}
        />
        <ActionCard
          id="card-followup"
          variant="secondary"
          title={t('dashboard.home.actions.follow_up.title', 'Faire un suivi')}
          description={t('dashboard.home.actions.follow_up.description', 'Mettez à jour l\'évolution de vos symptômes récents.')}
          icon={Calendar}
          onClick={() => navigate('/dashboard/suivis')}
        />
      </div>

      {/* Recent Evaluations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white">
            <Clock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <h3 className="text-xl font-bold tracking-tight">
              {t('dashboard.home.recent_evaluations.title', 'Évaluations récentes')}
            </h3>
          </div>
          <button
            onClick={() => navigate('/dashboard/historique')}
            className="text-sm font-semibold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400 hover:underline cursor-pointer"
          >
            {t('dashboard.home.recent_evaluations.view_all', "Voir tout l'historique")}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {recentEvaluations.length > 0 ? (
            recentEvaluations.map((evalItem) => (
              <EvaluationItem
                key={evalItem.id}
                title={evalItem.title}
                symptoms={evalItem.symptoms || ''}
                date={evalItem.date}
                confidence={evalItem.confidence}
                urgent={evalItem.alert}
                onClick={() => navigate(`/dashboard/historique`)}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center py-8">
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                {t('dashboard.home.recent_evaluations.empty', 'Aucune évaluation récente')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}