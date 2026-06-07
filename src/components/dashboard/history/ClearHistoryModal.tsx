import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ClearHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function ClearHistoryModal({ isOpen, onClose, onConfirm, isPending }: ClearHistoryModalProps) {
  const { t } = useTranslation();
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const handleClose = () => { setConfirmText(''); onClose(); };
  const valid = confirmText === 'ElPsyKongroo';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6 animate-scaleIn">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-red-50 dark:bg-red-950/40 p-3.5 rounded-full text-red-600 dark:text-red-400">
            <Trash2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('dashboard.pages.historique.clear_confirm_title', 'Confirmer la suppression')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('dashboard.pages.historique.clear_confirm_desc', 'Cette action est irréversible et supprimera tout votre historique de prédictions.')}
          </p>
          <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block mb-1">
              {t('dashboard.pages.historique.clear_confirm_type_code', 'Veuillez saisir le code de confirmation :')}
            </span>
            <code className="text-base font-extrabold tracking-widest text-slate-900 dark:text-white select-all">
              ElPsyKongroo
            </code>
          </div>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="ElPsyKongroo"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-550/50 focus:border-red-500 placeholder-slate-400 transition-all"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleClose} className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer">
            {t('common.cancel', 'Annuler')}
          </button>
          <button
            onClick={() => { if (valid) onConfirm(); }}
            disabled={!valid || isPending}
            className={`flex-1 font-bold py-3 rounded-xl text-sm transition-all cursor-pointer text-white ${
              valid && !isPending
                ? 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            {t('common.confirm', 'Confirmer')}
          </button>
        </div>
      </div>
    </div>
  );
}
