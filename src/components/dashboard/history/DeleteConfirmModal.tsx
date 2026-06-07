import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, isPending }: DeleteConfirmModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6 animate-scaleIn">
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
          <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer">
            {t('common.cancel', 'Annuler')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-red-500/20"
          >
            {isPending ? t('common.deleting', 'Suppression...') : t('common.delete', 'Supprimer')}
          </button>
        </div>
      </div>
    </div>
  );
}
