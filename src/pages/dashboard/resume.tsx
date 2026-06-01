import { ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ResumePage() {
  const { t } = useTranslation();

  return (
    <div id="resume-page" className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('dashboard.pages.resume.title', 'Résumé Médical')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('dashboard.pages.resume.description', 'Un résumé consolidé de votre profil de santé, prêt à être partagé avec votre médecin traitant.')}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-6">
          <div className="bg-primary-50 dark:bg-primary-950/40 p-4 rounded-full text-primary dark:text-primary-400">
            <ClipboardList className="h-12 w-12 stroke-[1.5]" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {t('dashboard.pages.resume.card_title', 'Résumé non généré')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('dashboard.pages.resume.card_desc', 'Veuillez compléter au moins une évaluation de symptômes et configurer votre profil médical pour obtenir un résumé médical.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
