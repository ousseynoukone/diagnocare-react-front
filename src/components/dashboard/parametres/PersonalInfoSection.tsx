import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Save, Lock, X } from 'lucide-react';
import { useUserStore } from '../../../store/UserStore';
import type { UpdateUserPayload } from '../../../store/UserStore';
import { toast } from 'sonner';
import { apiClient } from '../../../api-s/AxiosApiClient';

interface PersonalInfoSectionProps {
  user: any;
}

export default function PersonalInfoSection({ user }: PersonalInfoSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const updateUser = useUserStore((state) => state.updateUser);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phoneNumber ?? '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Email confirmation modal states
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<UpdateUserPayload | null>(null);

  const executeSaveProfile = async (payload: UpdateUserPayload) => {
    setIsSavingProfile(true);
    try {
      await updateUser(payload);
      toast.success(t('dashboard.pages.parametres.profile_saved', 'Profil mis à jour avec succès.'));
      
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

  return (
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
