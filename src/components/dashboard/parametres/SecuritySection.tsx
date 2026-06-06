import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '../../../store/UserStore';
import { toast } from 'sonner';

export default function SecuritySection() {
  const { t } = useTranslation();
  const updateUser = useUserStore((state) => state.updateUser);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error(t('dashboard.pages.parametres.pwd_too_short', 'Le mot de passe doit contenir au moins 8 caractères.'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('dashboard.pages.parametres.pwd_mismatch', 'Les mots de passe ne correspondent pas.'));
      return;
    }

    setIsSavingPassword(true);
    try {
      await updateUser({ password: newPassword });
      toast.success(t('dashboard.pages.parametres.pwd_saved', 'Mot de passe modifié avec succès.'));
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error(t('dashboard.pages.parametres.pwd_error', 'Erreur lors de la modification du mot de passe.'));
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {t('dashboard.pages.parametres.pwd_title', 'Changer le mot de passe')}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {t('dashboard.pages.parametres.pwd_subtitle', 'Minimum 8 caractères')}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('dashboard.pages.parametres.new_pwd', 'Nouveau mot de passe')}
        </label>
        <div className="relative">
          <input
            type={showNewPwd ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 pr-12 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
          />
          <button
            type="button"
            onClick={() => setShowNewPwd((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('dashboard.pages.parametres.confirm_pwd', 'Confirmer le mot de passe')}
        </label>
        <div className="relative">
          <input
            type={showConfirmPwd ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 pr-12 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPwd((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-xs text-red-500 font-semibold">
            {t('dashboard.pages.parametres.pwd_mismatch', 'Les mots de passe ne correspondent pas.')}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={handleChangePassword}
          disabled={isSavingPassword || !newPassword || !confirmPassword}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Lock className="h-4 w-4" />
          {isSavingPassword
            ? t('common.saving', 'Enregistrement...')
            : t('dashboard.pages.parametres.update_pwd', 'Mettre à jour')}
        </button>
      </div>
    </div>
  );
}
