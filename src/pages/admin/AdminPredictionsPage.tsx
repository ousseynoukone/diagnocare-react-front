import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, AlertTriangle, Brain, Filter, RefreshCw, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getAllPredictions, getRedAlertPredictions, adminDeletePrediction } from '../../api-s/requests/AdminRequest';
import PredictionDetailModal from '../../components/admin/PredictionDetailModal';

export default function AdminPredictionsPage() {
  const qc = useQueryClient();
  const [redAlertsOnly, setRedAlertsOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  const { data: all = [], isLoading: loadingAll, refetch: refetchAll } = useQuery({
    queryKey: ['admin-predictions'],
    queryFn: getAllPredictions,
    enabled: !redAlertsOnly,
  });

  const { data: alerts = [], isLoading: loadingAlerts, refetch: refetchAlerts } = useQuery({
    queryKey: ['admin-red-alerts'],
    queryFn: getRedAlertPredictions,
    enabled: redAlertsOnly,
  });

  const predictions = redAlertsOnly ? alerts : all;
  const isLoading = redAlertsOnly ? loadingAlerts : loadingAll;

  const deleteMutation = useMutation({
    mutationFn: adminDeletePrediction,
    onSuccess: () => {
      toast.success('Prédiction supprimée');
      qc.invalidateQueries({ queryKey: ['admin-predictions'] });
      qc.invalidateQueries({ queryKey: ['admin-red-alerts'] });
      setDeleteTarget(null);
    },
    onError: () => toast.error('Impossible de supprimer cette prédiction'),
  });

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-violet-500" />
            Prédictions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {all.length} prédiction{all.length !== 1 ? 's' : ''} · {alerts.length} alerte{alerts.length !== 1 ? 's' : ''} rouge{alerts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => (redAlertsOnly ? refetchAlerts() : refetchAll())}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {/* Filter toggle */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        <button
          onClick={() => setRedAlertsOnly(false)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            !redAlertsOnly
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-400'
          }`}
        >
          Toutes ({all.length})
        </button>
        <button
          onClick={() => setRedAlertsOnly(true)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            redAlertsOnly
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-400'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Alertes rouges ({alerts.length})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-violet-500 dark:border-slate-800 dark:border-t-violet-500" />
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Brain className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Aucune prédiction</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Meilleur score</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Alerte</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Statut</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {predictions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-mono text-xs">#{p.id}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {p.bestScore != null ? `${Number(p.bestScore).toFixed(2)}%` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      {p.isRedAlert ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 px-2.5 py-1 rounded-lg">
                          <AlertTriangle className="h-3 w-3" /> Rouge
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                        p.deleted
                          ? 'text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                          : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                      }`}>
                        {p.deleted ? 'Supprimée' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailId(p.id)}
                          className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 rounded-lg transition-colors cursor-pointer"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailId !== null && (
        <PredictionDetailModal predictionId={detailId} onClose={() => setDetailId(null)} />
      )}

      {/* Delete confirm */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 dark:bg-red-950/40 rounded-xl">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Supprimer la prédiction #{deleteTarget}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Cette action est irréversible.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                {deleteMutation.isPending ? 'Suppression…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
