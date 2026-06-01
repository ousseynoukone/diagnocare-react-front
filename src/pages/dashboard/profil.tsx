import { useUserStore } from '../../store/UserStore';
import { useTranslation } from 'react-i18next';

export default function ProfilMedicalPage() {
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();

  return (
    <div id="profil-page" className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('dashboard.pages.profil.title', 'Profil médical')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('dashboard.pages.profil.description', 'Gerez vos informations personnelles et de santé pour améliorer la pertinence de l\'analyse de l\'IA.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 shadow-sm">
          <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary-500/20 flex items-center justify-center text-primary dark:text-primary-400 font-bold text-2xl">
            {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'JD'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {user ? `${user.firstName} ${user.lastName}` : 'Jean Dupont'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || 'jean.dupont@email.com'}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400">
            {t('dashboard.pages.profil.patient_badge', 'Patient')}
          </span>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            {t('dashboard.pages.profil.info_title', 'Informations de base')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                {t('dashboard.pages.profil.first_name', 'Prénom')}
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm">
                {user?.firstName || 'Jean'}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                {t('dashboard.pages.profil.last_name', 'Nom')}
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm">
                {user?.lastName || 'Dupont'}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                {t('dashboard.pages.profil.email', 'Email')}
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm">
                {user?.email || 'jean.dupont@email.com'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
