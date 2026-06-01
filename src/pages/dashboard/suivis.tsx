import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SuivisPage() {
  const { t } = useTranslation();

  return (
    <div id="suivis-page" className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('dashboard.pages.suivis.title', "Suivis d'évolution")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('dashboard.pages.suivis.description', 'Suivez l\'évolution de vos symptômes déclarés et observez leur amélioration ou aggravation.')}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-full text-amber-600 dark:text-amber-400">
            <Clock className="h-12 w-12 stroke-[1.5]" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {t('dashboard.pages.suivis.card_title', 'Aucun suivi actif')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('dashboard.pages.suivis.card_desc', 'Vous n\'avez pas d\'évaluation récente nécessitant un suivi particulier. Les suivis s\'activent après une évaluation de symptômes.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
