import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Globe, Lock, Trash2, Save, Eye, EyeOff, Phone, Mail, AlertTriangle, X, Download
} from 'lucide-react';
import { useUserStore } from '../../store/UserStore';
import type { UpdateUserPayload } from '../../store/UserStore';
import { toast } from 'sonner';
import { apiClient } from '../../api-s/AxiosApiClient';

// ─── Reusable Row ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {children}
      </div>
    </div>
  );
}

function FieldRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-5 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
          {icon}
        </div>
        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{label}</span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ParametresPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const logout = useUserStore((state) => state.logout);

  // ── Profile state ──────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phoneNumber ?? '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // ── Confirm password state for email change ────────────────────────────────
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<UpdateUserPayload | null>(null);

  // ── Password state ─────────────────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // ── Delete modal state ─────────────────────────────────────────────────────
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // ── Export state ───────────────────────────────────────────────────────────
  const [isExporting, setIsExporting] = useState(false);

  // ── Language ───────────────────────────────────────────────────────────────
  const currentLang = i18n.language?.split('-')[0] ?? 'fr';

  const handleLangChange = async (lang: string) => {
    i18n.changeLanguage(lang);
    try {
      await updateUser({ lang });
      toast.success(lang === 'fr' ? 'Langue mise à jour.' : 'Language updated.');
    } catch {
      // language already switched locally, API failure is non-critical
    }
  };

  // ── Save profile ───────────────────────────────────────────────────────────
  const executeSaveProfile = async (payload: UpdateUserPayload) => {
    setIsSavingProfile(true);
    try {
      await updateUser(payload);
      toast.success(t('dashboard.pages.parametres.profile_saved', 'Profil mis à jour avec succès.'));
      
      // If email changed, clear user session and redirect to verify-email
      if (payload.email) {
        toast.info(t('dashboard.pages.parametres.email_verification_sent', 'Un code de vérification a été envoyé à votre nouvelle adresse email.'));
        useUserStore.getState().clearUser();
        navigate(`/verify-email?email=${encodeURIComponent(payload.email)}`);
      }
    } catch {
      toast.error(t('dashboard.pages.parametres.profile_error', 'Erreur lors de la mise à jour du profil.'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    const payload: UpdateUserPayload = {};
    if (firstName.trim() !== (user?.firstName ?? '')) payload.firstName = firstName.trim();
    if (lastName.trim() !== (user?.lastName ?? '')) payload.lastName = lastName.trim();
    if (email.trim() !== (user?.email ?? '')) payload.email = email.trim();
    if (phone.trim() !== (user?.phoneNumber ?? '')) payload.phoneNumber = phone.trim();

    if (Object.keys(payload).length === 0) {
      toast.info(t('dashboard.pages.parametres.profile_no_changes', 'Aucune modification détectée.'));
      return;
    }

    if (payload.email) {
      // Email change requires password verification
      setPendingPayload(payload);
      setConfirmPasswordInput('');
      setConfirmPasswordError('');
      setIsConfirmPasswordOpen(true);
      return;
    }

    await executeSaveProfile(payload);
  };

  const handleConfirmEmailChange = async () => {
    if (!confirmPasswordInput) {
      setConfirmPasswordError(t('dashboard.pages.parametres.confirm_pwd_required', 'Le mot de passe est requis.'));
      return;
    }
    if (!user?.email || !pendingPayload) return;

    setIsVerifyingPassword(true);
    setConfirmPasswordError('');
    try {
      // Re-authenticate using the login endpoint
      await apiClient.post('/auth/login', {
        email: user.email,
        password: confirmPasswordInput
      });

      setIsConfirmPasswordOpen(false);
      await executeSaveProfile(pendingPayload);
      setPendingPayload(null);
    } catch (err: any) {
      console.error('Password verification failed:', err);
      setConfirmPasswordError(t('dashboard.pages.parametres.confirm_pwd_incorrect', 'Mot de passe incorrect.'));
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // ── Change password ────────────────────────────────────────────────────────
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

  // ── Export data (RGPD) ────────────────────────────────────────────────────
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

  // ── Delete account ─────────────────────────────────────────────────────────
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

  // ── Logout ─────────────────────────────────────────────────────────────────
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
    <div id="parametres-page" className="space-y-8 max-w-2xl mx-auto pb-12 animate-fadeIn text-slate-800 dark:text-slate-100">

      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t('dashboard.pages.parametres.title', 'Paramètres')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {t('dashboard.pages.parametres.description', 'Gérez vos informations personnelles et les préférences de votre compte.')}
        </p>
      </div>

      {/* ── 1. Profile ──────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {t('dashboard.pages.parametres.profile_title', 'Informations personnelles')}
        </h2>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('dashboard.pages.parametres.first_name', 'Prénom')}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('dashboard.pages.parametres.last_name', 'Nom')}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {t('dashboard.pages.parametres.email', 'Adresse email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-555 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> {t('dashboard.pages.parametres.phone', 'Téléphone')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 00 00 00 00"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {isSavingProfile
                ? t('common.saving', 'Enregistrement...')
                : t('common.save', 'Enregistrer')}
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Language ─────────────────────────────────────────────────────── */}
      <SectionCard title={t('dashboard.pages.parametres.lang_title', 'Langue')}>
        <FieldRow icon={<Globe className="h-5 w-5" />} label={t('dashboard.pages.parametres.lang_label', "Langue de l'interface")}>
          <div className="flex gap-2">
            {(['fr', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                  currentLang === lang
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {lang === 'fr' ? 'Français' : 'English'}
              </button>
            ))}
          </div>
        </FieldRow>
      </SectionCard>

      {/* ── 3. Password ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {t('dashboard.pages.parametres.security_title', 'Sécurité')}
        </h2>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 mb-1">
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

          <div className="space-y-1.5">
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

          <div className="space-y-1.5">
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
      </div>

      {/* ── 4. Privacy & GDPR ───────────────────────────────────────────────── */}
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

      {/* ── 5. Danger zone ──────────────────────────────────────────────────── */}
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

      {/* ── Logout button ────────────────────────────────────────────────────── */}
      <button
        id="btn-logout"
        onClick={handleLogout}
        className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
      >
        <LogOut className="h-4 w-4" />
        <span>{t('dashboard.pages.parametres.logout', 'Se déconnecter')}</span>
      </button>

      {/* ── Delete account confirmation modal ────────────────────────────────── */}
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

      {/* ── Confirm password modal for email change ─────────────────────────── */}
      {isConfirmPasswordOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6 animate-scaleIn">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-full text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('dashboard.pages.parametres.confirm_email_title', 'Confirmer la modification')}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsConfirmPasswordOpen(false);
                  setPendingPayload(null);
                }} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('dashboard.pages.parametres.confirm_email_desc', 'Pour modifier votre adresse email, veuillez confirmer votre mot de passe actuel par mesure de sécurité.')}
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('dashboard.pages.parametres.password_label', 'Mot de passe actuel')}
              </label>
              <input
                type="password"
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                placeholder={t('dashboard.pages.parametres.confirm_pwd_placeholder', 'Saisissez votre mot de passe actuel')}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
              />
              {confirmPasswordError && (
                <p className="text-xs text-red-500 font-semibold">{confirmPasswordError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsConfirmPasswordOpen(false);
                  setPendingPayload(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleConfirmEmailChange}
                disabled={isVerifyingPassword || !confirmPasswordInput}
                className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed text-white dark:text-slate-900 font-bold py-3 rounded-xl text-sm transition-all cursor-pointer shadow-md"
              >
                {isVerifyingPassword
                  ? t('common.loading', 'Chargement...')
                  : t('common.confirm', 'Confirmer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
