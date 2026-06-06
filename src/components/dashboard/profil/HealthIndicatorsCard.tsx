import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HealthIndicatorsCardProps {
  tension: string;
  cholesterol: string;
  antecedents: string;
  onChange: (field: 'tension' | 'cholesterol' | 'antecedents', value: string) => void;
}

const inputCls =
  'w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500';

export default function HealthIndicatorsCard({ tension, cholesterol, antecedents, onChange }: HealthIndicatorsCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <Activity className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t('dashboard.pages.profil.section_indicators', 'Indicateurs de santé')}
        </h2>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Arterial Pressure */}
          <div className="space-y-2">
            <label htmlFor="profile-tension" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t('dashboard.pages.profil.tension', 'Tension artérielle moyenne')}
            </label>
            <input
              id="profile-tension"
              type="text"
              value={tension}
              onChange={(e) => onChange('tension', e.target.value)}
              placeholder="Ex: 12/8"
              className={inputCls}
            />
          </div>

          {/* Cholesterol */}
          <div className="space-y-2">
            <label htmlFor="profile-cholesterol" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t('dashboard.pages.profil.cholesterol', 'Cholestérol total (g/L)')}
            </label>
            <input
              id="profile-cholesterol"
              type="text"
              value={cholesterol}
              onChange={(e) => onChange('cholesterol', e.target.value)}
              placeholder="Ex: 1.90"
              className={inputCls}
            />
          </div>
        </div>

        {/* Medical History Textarea */}
        <div className="space-y-2">
          <label htmlFor="profile-antecedents" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t('dashboard.pages.profil.antecedents', 'Antécédents familiaux majeurs')}
          </label>
          <textarea
            id="profile-antecedents"
            rows={3}
            value={antecedents}
            onChange={(e) => onChange('antecedents', e.target.value)}
            placeholder={t('dashboard.pages.profil.antecedents_placeholder', 'Diabète, hypertension, maladies cardiaques...')}
            className={inputCls + ' resize-none'}
          />
        </div>
      </div>
    </div>
  );
}
