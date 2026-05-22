import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p>{t('footer.built_for', { year: new Date().getFullYear() })}</p>
        <p className="text-slate-400 dark:text-slate-500">{t('footer.designed_for')}</p>
      </div>
    </footer>
  )
}
