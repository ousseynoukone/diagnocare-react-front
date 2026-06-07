import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Brain, AlertTriangle, FileText, TrendingUp, ShieldAlert, Eye } from 'lucide-react';
import { getAllUsers, getAllPredictions, getRedAlertPredictions, getUncorrectedReports, getUrgentDiseases } from '../../api-s/requests/AdminRequest';
import { useUserStore } from '../../store/UserStore';
import PredictionDetailModal from '../../components/admin/PredictionDetailModal';

function StatCard({
  label, value, icon: Icon, color, sub,
}: {
  label: string; value: number | string; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-5">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const user = useUserStore((s) => s.user);
  const [detailId, setDetailId] = useState<number | null>(null);

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const { data: predictions = [], isLoading: loadingPredictions } = useQuery({
    queryKey: ['admin-predictions'],
    queryFn: getAllPredictions,
  });

  const { data: redAlerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ['admin-red-alerts'],
    queryFn: getRedAlertPredictions,
  });

  const { data: reports = [], isLoading: loadingReports } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: getUncorrectedReports,
  });

  const { data: urgentDiseases = [] } = useQuery({
    queryKey: ['admin-urgent-diseases'],
    queryFn: getUrgentDiseases,
  });

  const isLoading = loadingUsers || loadingPredictions || loadingAlerts || loadingReports;

  const recentRedAlerts = redAlerts.slice(0, 5);
  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Administration
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Bonjour {user?.firstName} — voici l'état global de la plateforme.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Utilisateurs"
            value={users.length}
            icon={Users}
            color="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            label="Prédictions"
            value={predictions.length}
            icon={Brain}
            color="bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
          />
          <StatCard
            label="Alertes rouges"
            value={redAlerts.length}
            icon={AlertTriangle}
            color="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
          />
          <StatCard
            label="Signalements"
            value={reports.length}
            icon={FileText}
            color="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
            sub="En attente de traitement"
          />
        </div>
      )}

      {/* Recent activity grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent red alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Alertes rouges récentes</h2>
          </div>
          {recentRedAlerts.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">Aucune alerte active</p>
          ) : (
            <div className="space-y-2">
              {recentRedAlerts.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Prédiction #{p.id}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg">
                      {p.bestScore != null ? `${Number(p.bestScore).toFixed(1)}%` : '—'}
                    </span>
                    <button
                      onClick={() => setDetailId(p.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                      title="Voir les détails"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent reports */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Signalements en attente</h2>
          </div>
          {recentReports.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">Aucun signalement en attente</p>
          ) : (
            <div className="space-y-2">
              {recentReports.map((r) => (
                <div key={r.id} className="flex items-start justify-between px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {r.title || r.comment || `Signalement #${r.id}`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {r.predictionId ? `Prédiction #${r.predictionId}` : '—'}
                      {r.userId ? ` · Utilisateur #${r.userId}` : ''}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg shrink-0 whitespace-nowrap">
                    En attente
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Urgent diseases summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-violet-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Maladies urgentes enregistrées ({urgentDiseases.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {urgentDiseases.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune maladie urgente configurée</p>
            ) : (
              urgentDiseases.map((d) => (
                <span key={d.id} className="text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 px-3 py-1.5 rounded-xl">
                  {d.diseaseName}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {detailId !== null && (
        <PredictionDetailModal predictionId={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
}
