import ToggleDarkMode from '../../components/basics/ToggleDarkMode';
import SwitchLanguage from '../../components/basics/SwitchLanguage';
import { useTranslation } from 'react-i18next';

export default function ParametresPage() {
  const { t } = useTranslation();

  return (
    <div id="parametres-page" className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('dashboard.pages.parametres.title', 'Paramètres')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('dashboard.pages.parametres.description', "Gérez l'affichage de l'application, vos préférences linguistiques et de sécurité.")}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            {t('dashboard.pages.parametres.pref_title', "Préférences de l'application")}
          </h3>
          
          {/* Theme setting */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {t('dashboard.pages.parametres.theme_label', "Mode d'affichage")}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('dashboard.pages.parametres.theme_desc', "Basculez entre le mode clair et le mode sombre.")}
              </p>
            </div>
            <ToggleDarkMode />
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Language setting */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {t('dashboard.pages.parametres.lang_label', 'Langue')}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('dashboard.pages.parametres.lang_desc', 'Sélectionnez votre langue de préférence.')}
              </p>
            </div>
            <SwitchLanguage />
          </div>
        </div>
      </div>
    </div>
  );
}
