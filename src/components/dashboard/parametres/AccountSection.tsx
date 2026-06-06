import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Download, AlertTriangle, X } from 'lucide-react';
import { useUserStore } from '../../../store/UserStore';
import { toast } from 'sonner';
import { apiClient } from '../../../api-s/AxiosApiClient';

interface AccountSectionProps {
  user: any;
}

export default function AccountSection({ user }: AccountSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Export state
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    if (!user?.id) return;
    setIsExporting(true);
    try {
      const response = await apiClient.get(`/users/${user.id}/export`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `diagnocare-data-export-${user.id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t('dashboard.pages.parametres.export_success', 'Export téléchargé avec succès.'));
    } catch {
      toast.error(t('dashboard.pages.parametres.export_error', "Erreur lors de l'export des données."));
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    setIsDeletingAccount(true);
    try {
      await apiClient.delete(`/auth/users/${user.id}`);
      useUserStore.getState().clearUser();
      navigate('/');
    } catch {
      toast.error(t('dashboard.pages.parametres.delete_error', 'Erreur lors de la suppression du compte.'));
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      useUserStore.getState().clearUser();
    } finally {
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      {/* Export data */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {t('dashboard.pages.parametres.privacy_title', 'Confidentialité et RGPD')}
        </h2>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-start justify-between gap-4 p-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 shrink-0 mt-0.5">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('dashboard.pages.parametres.export_title', 'Exporter mes données')}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {t('dashboard.pages.parametres.export_desc', 'Téléchargez toutes vos données personnelles au format JSON (RGPD).')}
                </p>
              </div>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="shrink-0 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 font-bold px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isExporting
                ? t('common.loading', 'Chargement...')
                : t('dashboard.pages.parametres.export_btn', 'Télécharger')}
            </button>
          </div>
        </div>
      </div>

      {/* Delete account */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-red-650 dark:text-red-400">
          {t('dashboard.pages.parametres.danger_title', 'Zone dangereuse')}
        </h2>
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-start justify-between gap-4 p-6">
            <div className="flex items-start gap-3">
              <div className="bg-red-50 dark:bg-red-950/40 p-2 rounded-xl text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 shrink-0 mt-0.5">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('dashboard.pages.parametres.delete_account', 'Supprimer le compte')}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {t('dashboard.pages.parametres.delete_desc', 'Action irréversible. Toutes vos données seront supprimées.')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="shrink-0 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 font-bold px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer"
            >
              {t('common.delete', 'Supprimer')}
            </button>
          </div>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
      >
        <LogOut className="h-4 w-4" />
        <span>{t('dashboard.pages.parametres.logout', 'Se déconnecter')}</span>
      </button>

      {/* Delete account confirmation modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6 animate-scaleIn">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 dark:bg-red-950/40 p-2.5 rounded-full text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('dashboard.pages.parametres.delete_confirm_title', 'Supprimer le compte ?')}
                </h3>
              </div>
              <button onClick={() => setIsDeleteOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('dashboard.pages.parametres.delete_confirm_desc', 'Cette action est permanente et irréversible. Toutes vos prédictions, votre profil médical et vos données seront définitivement supprimés.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-red-500/20"
              >
                {isDeletingAccount
                  ? t('common.deleting', 'Suppression...')
                  : t('dashboard.pages.parametres.delete_confirm_btn', 'Oui, supprimer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
