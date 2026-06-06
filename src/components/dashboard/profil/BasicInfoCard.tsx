import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomSelect from '../../basics/CustomSelect';

interface BasicInfoCardProps {
  age: string;
  sexe: string;
  poids: string;
  taille: string;
  onChange: (field: 'age' | 'sexe' | 'poids' | 'taille', value: string) => void;
}

const inputCls =
  'w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500';

export default function BasicInfoCard({ age, sexe, poids, taille, onChange }: BasicInfoCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <User className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t('dashboard.pages.profil.section_basic', 'Informations de base')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Age */}
        <div className="space-y-2">
          <label htmlFor="profile-age" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t('dashboard.pages.profil.age', 'Âge')}
          </label>
          <input
            id="profile-age"
            type="number"
            value={age}
            onChange={(e) => onChange('age', e.target.value)}
            placeholder="Ex: 35"
            className={inputCls}
          />
        </div>

        {/* Biological Sex */}
        <div className="space-y-2">
          <label htmlFor="profile-sexe" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t('dashboard.pages.profil.sexe', 'Sexe biologique')}
          </label>
          <CustomSelect
            id="profile-sexe"
            value={sexe}
            options={[
              { value: 'Homme', label: t('dashboard.pages.profil.sexe_options.homme', 'Homme') },
              { value: 'Femme', label: t('dashboard.pages.profil.sexe_options.femme', 'Femme') },
              { value: 'Autre', label: t('dashboard.pages.profil.sexe_options.autre', 'Autre') },
            ]}
            onChange={(val) => onChange('sexe', val)}
            className="w-full"
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label htmlFor="profile-poids" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t('dashboard.pages.profil.poids', 'Poids (kg)')}
          </label>
          <input
            id="profile-poids"
            type="number"
            value={poids}
            onChange={(e) => onChange('poids', e.target.value)}
            placeholder="Ex: 75"
            className={inputCls}
          />
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label htmlFor="profile-taille" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t('dashboard.pages.profil.taille', 'Taille (cm)')}
          </label>
          <input
            id="profile-taille"
            type="number"
            value={taille}
            onChange={(e) => onChange('taille', e.target.value)}
            placeholder="Ex: 175"
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}
