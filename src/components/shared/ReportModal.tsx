import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCreateReport } from '../../hooks/useReports';
import { useUserStore } from '../../store/UserStore';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  predId: number | null;
}

export default function ReportModal({ isOpen, onClose, predId }: ReportModalProps) {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const createReportMutation = useCreateReport();
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!user?.id || !predId) return;
    if (!title.trim() || !comment.trim()) {
      toast.error(t('dashboard.pages.evaluation.report_fields_required', 'Veuillez remplir le titre et le commentaire.'));
      return;
    }
    try {
      await createReportMutation.mutateAsync({ userId: user.id, predictionId: predId, title, comment });
      toast.success(t('dashboard.pages.evaluation.report_success', 'Signalement envoyé avec succès.'));
      setTitle('');
      setComment('');
      onClose();
    } catch {
      toast.error(t('dashboard.pages.evaluation.report_error', "Erreur lors de l'envoi du signalement."));
    }
  };

  const handleClose = () => { setTitle(''); setComment(''); onClose(); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-8 space-y-6 animate-scaleIn">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('dashboard.pages.evaluation.report_modal_title', 'Signaler un problème')}
            </h3>
          </div>
          <button onClick={handleClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider">
              {t('dashboard.pages.evaluation.report_title_label', "Titre de l'anomalie")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('dashboard.pages.evaluation.report_title_placeholder', 'Ex: Diagnostic incohérent, symptômes erronés...')}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider">
              {t('dashboard.pages.evaluation.report_comment_label', 'Commentaires')}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder={t('dashboard.pages.evaluation.report_comment_placeholder', 'Décrivez en détail le problème rencontré...')}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-slate-400 dark:placeholder-slate-500 transition-all resize-none shadow-inner leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={handleClose} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-6 py-3 rounded-xl text-sm transition-colors cursor-pointer">
            {t('common.cancel', 'Annuler')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={createReportMutation.isPending || !title.trim() || !comment.trim()}
            className={`font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer text-white shadow-md ${
              !title.trim() || !comment.trim()
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50 shadow-none'
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900'
            }`}
          >
            {createReportMutation.isPending ? t('common.sending', 'Envoi...') : t('common.send', 'Envoyer')}
          </button>
        </div>
      </div>
    </div>
  );
}
