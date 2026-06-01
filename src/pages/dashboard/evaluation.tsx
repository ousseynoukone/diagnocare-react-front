import { Activity, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EvaluationPage() {
  const { t } = useTranslation();

  return (
    <div id="evaluation-page" className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('dashboard.pages.evaluation.title', 'Nouvelle Évaluation')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('dashboard.pages.evaluation.description', 'Commencez une nouvelle analyse de vos symptômes assistée par notre intelligence artificielle.')}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-6">
          <div className="bg-primary-50 dark:bg-primary-950/40 p-4 rounded-full text-primary dark:text-primary-400">
            <Activity className="h-12 w-12 stroke-[1.5]" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {t('dashboard.pages.evaluation.card_title', 'Prêt à commencer ?')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('dashboard.pages.evaluation.card_desc', "L'évaluation prend environ 3 minutes. Veuillez répondre honnêtement aux questions pour obtenir des hypothèses précises.")}
            </p>
          </div>
          <button 
            id="btn-start-evaluation"
            className="flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-primary/25 transition-all duration-200 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-white" />
            {t('dashboard.pages.evaluation.start_button', "Lancer l'évaluation")}
          </button>
        </div>
      </div>
    </div>
  );
}
