import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomSelect from '../../basics/CustomSelect';

interface LifeHabitsCardProps {
  tabac: 'oui' | 'non';
  alcool: 'reguliere' | 'occasionnelle' | 'jamais';
  activite: string;
  onChange: (field: 'tabac' | 'alcool' | 'activite', value: string) => void;
}

const radioCls = 'h-4 w-4 accent-primary cursor-pointer';

export default function LifeHabitsCard({ tabac, alcool, activite, onChange }: LifeHabitsCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <Heart className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t('dashboard.pages.profil.section_habits', 'Habitudes de vie')}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Tobacco */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('dashboard.pages.profil.tabac', 'Consommation de tabac')}
          </span>
          <div className="flex items-center gap-6">
            {(['oui', 'non'] as const).map((val) => (
              <label key={val} className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="profile-tabac"
                  checked={tabac === val}
                  onChange={() => onChange('tabac', val)}
                  className={radioCls}
                />
                <span>
                  {val === 'oui'
                    ? t('dashboard.pages.profil.tabac_options.oui', 'Oui')
                    : t('dashboard.pages.profil.tabac_options.non', 'Non')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Alcohol */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('dashboard.pages.profil.alcool', "Consommation d'alcool")}
          </span>
          <div className="flex flex-wrap items-center gap-6">
            {(
              [
                { val: 'reguliere', label: t('dashboard.pages.profil.alcool_options.reguliere', 'Régulière') },
                { val: 'occasionnelle', label: t('dashboard.pages.profil.alcool_options.occasionnelle', 'Occasionnelle') },
                { val: 'jamais', label: t('dashboard.pages.profil.alcool_options.jamais', 'Jamais') },
              ] as { val: 'reguliere' | 'occasionnelle' | 'jamais'; label: string }[]
            ).map(({ val, label }) => (
              <label key={val} className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="profile-alcool"
                  checked={alcool === val}
                  onChange={() => onChange('alcool', val)}
                  className={radioCls}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Physical Activity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('dashboard.pages.profil.activite', 'Activité physique (sédentarité)')}
          </span>
          <CustomSelect
            value={activite}
            options={[
              {
                value: 'Sédentaire (peu ou pas de sport)',
                label: t('dashboard.pages.profil.activite_options.sedentaire', 'Sédentaire (peu ou pas de sport)'),
              },
              {
                value: 'Actif (1-3 séances de sport/semaine)',
                label: t('dashboard.pages.profil.activite_options.actif', 'Actif (1-3 séances de sport/semaine)'),
              },
              {
                value: 'Très actif (plus de 3 séances/semaine)',
                label: t('dashboard.pages.profil.activite_options.tres_actif', 'Très actif (plus de 3 séances/semaine)'),
              },
            ]}
            onChange={(val) => onChange('activite', val)}
            dropUp={true}
            className="w-full sm:w-[320px]"
          />
        </div>
      </div>
    </div>
  );
}
