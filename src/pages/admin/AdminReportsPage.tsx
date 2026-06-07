import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Trash2, AlertTriangle, FileText, RefreshCw, Eye, User } from 'lucide-react';
import { toast } from 'sonner';
import { getUncorrectedReports, markReportCorrected, deleteReport, getAllUsers } from '../../api-s/requests/AdminRequest';
import PredictionDetailModal from '../../components/admin/PredictionDetailModal';

export default function AdminReportsPage() {
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [predictionDetailId, setPredictionDetailId] = useState<number | null>(null);

  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: getUncorrectedReports,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const userMap = new Map(users.map((u) => [u.id, `${u.firstName} ${u.lastName}`]));

  const correctMutation = useMutation({
    mutationFn: markReportCorrected,
    onSuccess: () => {
      toast.success('Signalement marqué comme corrigé');
      qc.invalidateQueries({ queryKey: ['admin-reports'] });
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      toast.success('Signalement supprimé');
      qc.invalidateQueries({ queryKey: ['admin-reports'] });
      setDeleteTarget(null);
    },
    onError: () => toast.error('Impossible de supprimer ce signalement'),
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Signalements
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {reports.length} signalement{reports.length !== 1 ? 's' : ''} en attente
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-amber-500 dark:border-slate-800 dark:border-t-amber-500" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-400" />
          <p className="font-semibold text-emerald-600 dark:text-emerald-400">Tous les signalements ont été traités</p>
          <p className="text-sm mt-1">Aucun signalement en attente de correction.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => {
            const userName = r.userId ? userMap.get(r.userId) : null;
            return (
              <div
                key={r.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Report body */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl shrink-0">
                        <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-slate-400">#{r.id}</span>
                          <span className="text-xs text-slate-400">{formatDate(r.reportDate)}</span>
                        </div>

                        {r.title && (
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</p>
                        )}

                        {r.comment ? (
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {r.comment}
                          </p>
                        ) : (
                          <p className="text-sm italic text-slate-400">Aucun commentaire</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => correctMutation.mutate(r.id)}
                        disabled={correctMutation.isPending && correctMutation.variables === r.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-semibold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Corrigé
                      </button>
                      <button
                        onClick={() => setDeleteTarget(r.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer: user + prediction */}
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
                  {r.userId && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      {userName ? (
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{userName}</span>
                      ) : (
                        <span className="font-mono">Utilisateur #{r.userId}</span>
                      )}
                    </div>
                  )}
                  {r.predictionId && (
                    <button
                      onClick={() => setPredictionDetailId(r.predictionId!)}
                      className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Voir prédiction #{r.predictionId}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prediction detail modal */}
      {predictionDetailId !== null && (
        <PredictionDetailModal
          predictionId={predictionDetailId}
          onClose={() => setPredictionDetailId(null)}
        />
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
                <h3 className="font-bold text-slate-900 dark:text-white">Supprimer le signalement</h3>
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
