import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Save } from 'lucide-react';
import { toast } from 'sonner';
import BasicInfoCard from '../../components/dashboard/profil/BasicInfoCard';
import HealthIndicatorsCard from '../../components/dashboard/profil/HealthIndicatorsCard';
import LifeHabitsCard from '../../components/dashboard/profil/LifeHabitsCard';

export interface MedicalProfile {
  age: string;
  sexe: string;
  poids: string;
  taille: string;
  tension: string;
  cholesterol: string;
  antecedents: string;
  tabac: 'oui' | 'non';
  alcool: 'reguliere' | 'occasionnelle' | 'jamais';
  activite: string;
}

const PROFILE_STORAGE_KEY = 'diagnocare-medical-profile';

const DEFAULT_PROFILE: MedicalProfile = {
  age: '',
  sexe: 'Homme',
  poids: '',
  taille: '',
  tension: '',
  cholesterol: '',
  antecedents: '',
  tabac: 'non',
  alcool: 'jamais',
  activite: 'Sédentaire (peu ou pas de sport)',
};

export default function ProfilMedicalPage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<MedicalProfile>(DEFAULT_PROFILE);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading medical profile:', e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    toast.success(t('dashboard.pages.profil.save_success', 'Profil médical enregistré avec succès !'));
  };

  const updateField = (field: keyof MedicalProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div id="profil-page" className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn text-slate-800 dark:text-slate-100">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Header section with Title and CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t('dashboard.pages.profil.title', 'Profil Médical')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t('dashboard.pages.profil.description', 'Ces informations permettent d\'affiner la précision de nos prédictions.')}
            </p>
          </div>
          
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 active:bg-primary-800 text-white font-bold px-5 py-3 rounded-xl shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-200 cursor-pointer shrink-0"
          >
            <Save className="h-4.5 w-4.5" />
            <span>{t('dashboard.pages.profil.save_btn', 'Enregistrer')}</span>
          </button>
        </div>

        {/* Security Info Banner */}
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-xs">
          <div className="bg-blue-100/60 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <p className="text-xs sm:text-sm text-blue-750 dark:text-blue-300 leading-relaxed font-semibold">
            {t('dashboard.pages.profil.security_banner', 'Vos données sont stockées de manière sécurisée et ne sont utilisées que pour l\'analyse de vos symptômes. Elles ne sont jamais partagées avec des tiers publicitaires.')}
          </p>
        </div>

        {/* Card 1: Basic Info */}
        <BasicInfoCard
          age={profile.age}
          sexe={profile.sexe}
          poids={profile.poids}
          taille={profile.taille}
          onChange={updateField}
        />

        {/* Card 2: Health Indicators */}
        <HealthIndicatorsCard
          tension={profile.tension}
          cholesterol={profile.cholesterol}
          antecedents={profile.antecedents}
          onChange={updateField}
        />

        {/* Card 3: Habits */}
        <LifeHabitsCard
          tabac={profile.tabac}
          alcool={profile.alcool}
          activite={profile.activite}
          onChange={updateField}
        />
      </form>
    </div>
  );
}
