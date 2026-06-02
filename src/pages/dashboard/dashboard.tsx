import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, Clock, Plus, Calendar } from 'lucide-react';
import { useUserStore } from '../../store/UserStore';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import AlertBanner from '../../components/dashboard/AlertBanner';
import ActionCard from '../../components/dashboard/ActionCard';
import EvaluationItem from '../../components/dashboard/EvaluationItem';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const getFirstName = () => {
    return user?.firstName || 'Jean';
  };

  // Mock list of recent evaluations
  const recentEvaluations = [
    {
      id: 'eval-1',
      title: t('dashboard.home.evaluations_list.migraine.title', 'Migraine probable'),
      symptoms: t('dashboard.home.evaluations_list.migraine.symptoms', 'Maux de tête, fièvre légère'),
      date: t('dashboard.home.evaluations_list.migraine.date', "Aujourd'hui, 09:41"),
      confidence: 85,
      urgent: false,
    },
    {
      id: 'eval-2',
      title: t('dashboard.home.evaluations_list.urgent.title', 'Consultation urgente requise'),
      symptoms: t('dashboard.home.evaluations_list.urgent.symptoms', 'Douleur thoracique, essoufflement'),
      date: t('dashboard.home.evaluations_list.urgent.date', 'Hier, 14:20'),
      confidence: 92,
      urgent: true,
    },
    {
      id: 'eval-3',
      title: t('dashboard.home.evaluations_list.viral.title', 'Infection virale bénigne'),
      symptoms: t('dashboard.home.evaluations_list.viral.symptoms', 'Toux sèche, fatigue'),
      date: t('dashboard.home.evaluations_list.viral.date', '12 Oct, 10:15'),
      confidence: 78,
      urgent: false,
    },
  ];

  return (
    <div className="h-full flex flex-col min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top dashboard header (Language & Account) */}
      <DashboardHeader />

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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1.5 shadow-sm text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0">
          {t('dashboard.home.last_updated', "Dernière màj: à l'instant")}
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          label={t('dashboard.home.stats.evaluations.label', 'Total évaluations')}
          value={t('dashboard.home.stats.evaluations.value', '12')}
          trend="+2"
          subtext={t('dashboard.home.stats.evaluations.subtext', 'ce mois-ci')}
          icon={FileText}
          iconBgClass="bg-blue-50 dark:bg-blue-950/40"
          iconColorClass="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          label={t('dashboard.home.stats.alerts.label', 'Alertes actives')}
          value={t('dashboard.home.stats.alerts.value', '1')}
          trend={t('dashboard.home.stats.alerts.subtext', 'Action requise')}
          trendColor="text-red-500 dark:text-red-400"
          subtext=""
          icon={AlertTriangle}
          iconBgClass="bg-red-50 dark:bg-red-950/40"
          iconColorClass="text-red-600 dark:text-red-400"
        />
        <StatsCard
          label={t('dashboard.home.stats.next_followup.label', 'Prochain suivi')}
          value={t('dashboard.home.stats.next_followup.value', '24h')}
          subtext={t('dashboard.home.stats.next_followup.subtext', 'Grippe saisonnière')}
          icon={Clock}
          iconBgClass="bg-amber-50 dark:bg-amber-950/40"
          iconColorClass="text-amber-500 dark:text-amber-400"
        />
      </div>

      {/* Emergency Warning Banner */}
      <AlertBanner />

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
          {recentEvaluations.map((evalItem) => (
            <EvaluationItem
              key={evalItem.id}
              title={evalItem.title}
              symptoms={evalItem.symptoms}
              date={evalItem.date}
              confidence={evalItem.confidence}
              urgent={evalItem.urgent}
              onClick={() => navigate(`/dashboard/historique`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}