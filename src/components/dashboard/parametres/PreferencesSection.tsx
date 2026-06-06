import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useUserStore } from '../../../store/UserStore';
import { toast } from 'sonner';

export default function PreferencesSection() {
  const { t, i18n } = useTranslation();
  const updateUser = useUserStore((state) => state.updateUser);

  const currentLang = i18n.language?.split('-')[0] ?? 'fr';

  const handleLangChange = async (lang: string) => {
    i18n.changeLanguage(lang);
    try {
      await updateUser({ lang });
      toast.success(lang === 'fr' ? 'Langue mise à jour.' : 'Language updated.');
    } catch {
      // Language already switched locally
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        {t('dashboard.pages.parametres.lang_title', 'Langue')}
      </h2>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
            <Globe className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {t('dashboard.pages.parametres.lang_label', "Langue de l'interface")}
          </span>
        </div>
        
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
      </div>
    </div>
  );
}
