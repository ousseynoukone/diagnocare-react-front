import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '../../store/UserStore';
import { useProfile, useSaveProfile } from '../../hooks/useProfile';
import BasicInfoCard from '../../components/dashboard/profil/BasicInfoCard';
import HealthIndicatorsCard from '../../components/dashboard/profil/HealthIndicatorsCard';
import LifeHabitsCard from '../../components/dashboard/profil/LifeHabitsCard';
import {  DEFAULT_PROFILE, PROFILE_STORAGE_KEY, type MedicalProfile } from '../../types/models/MedicalProfil';
import { GenderEnum } from '../../types/models/enums/GenderEnum';


export default function ProfilMedicalPage() {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);

  const { data: dbProfile, isLoading: isProfileLoading } = useProfile(user?.id);
  const saveProfileMutation = useSaveProfile();

  const [profile, setProfile] = useState<MedicalProfile>(DEFAULT_PROFILE);

  // Sync state when dbProfile is loaded/updated
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    let currentProfile = saved ? JSON.parse(saved) : DEFAULT_PROFILE;

    if (dbProfile) {
      currentProfile = {
        ...currentProfile,
        age: dbProfile.age ? String(dbProfile.age) : currentProfile.age,
        sexe: dbProfile.gender === 'FEMALE' ? 'Femme' : (dbProfile.gender === 'MALE' ? 'Homme' : currentProfile.sexe),
        poids: dbProfile.weight ? String(dbProfile.weight) : currentProfile.poids,
        taille: currentProfile.taille || (dbProfile.bmi && dbProfile.weight ? String(Math.round(Math.sqrt(dbProfile.weight / dbProfile.bmi) * 100)) : ''),
        tension: dbProfile.meanBloodPressure ? String(Math.round(dbProfile.meanBloodPressure / 10)) : currentProfile.tension,
        cholesterol: dbProfile.meanCholesterol ? (dbProfile.meanCholesterol / 100).toFixed(2) : currentProfile.cholesterol,
        antecedents: dbProfile.familyAntecedents && dbProfile.familyAntecedents.length > 0 ? dbProfile.familyAntecedents.join(', ') : currentProfile.antecedents,
        tabac: dbProfile.isSmoking !== undefined ? (dbProfile.isSmoking ? 'oui' : 'non') : currentProfile.tabac,
        alcool: dbProfile.alcohol !== undefined ? (dbProfile.alcohol ? (currentProfile.alcool !== 'jamais' ? currentProfile.alcool : 'occasionnelle') : 'jamais') : currentProfile.alcool,
        activite: dbProfile.sedentary !== undefined ? (dbProfile.sedentary ? 'Sédentaire (peu ou pas de sport)' : (currentProfile.activite !== 'Sédentaire (peu ou pas de sport)' ? currentProfile.activite : 'Actif (1-3 séances de sport/semaine)')) : currentProfile.activite,
      };
    }
    setProfile(currentProfile);
  }, [dbProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    // Save to local storage for local detail retention (e.g. height, specific activity string)
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));

    // Convert local MedicalProfile to PatientMedicalProfileRequestDTO
    const age = parseInt(profile.age) || 0;
    const gender = profile.sexe === 'Femme' ? GenderEnum.FEMALE : (profile.sexe === 'Homme' ? GenderEnum.MALE : null);
    const weight = parseFloat(profile.poids) || 0;
    const heightCm = parseFloat(profile.taille) || 0;

    // Calculate BMI
    const heightM = heightCm / 100;
    const bmi = weight && heightM ? Math.round(weight / (heightM * heightM)) : 0;

    // Parse blood pressure (systolic)
    let meanBloodPressure = 0;
    if (profile.tension) {
      const parts = profile.tension.split('/');
      const sys = parseFloat(parts[0]) || 0;
      meanBloodPressure = sys <= 20 ? sys * 10 : sys;
    }

    // Parse cholesterol (g/L to mg/dL, or keeps mg/dL)
    const rawChol = parseFloat(profile.cholesterol) || 0;
    const meanCholesterol = rawChol > 10 ? rawChol : rawChol * 100;

    const sedentary = profile.activite.includes('Sédentaire');
    const isSmoking = profile.tabac === 'oui';
    const alcohol = profile.alcool !== 'jamais';
    const familyAntecedents = profile.antecedents
      ? profile.antecedents.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const requestPayload = {
      userId: user.id,
      age,
      gender,
      weight,
      meanBloodPressure: meanBloodPressure || undefined,
      meanCholesterol: meanCholesterol || undefined,
      sedentary,
      bmi,
      alcohol,
      isSmoking,
      familyAntecedents,
    };

    try {
      await saveProfileMutation.mutateAsync(requestPayload);
      toast.success(t('dashboard.pages.profil.save_success', 'Profil médical enregistré avec succès !'));
    } catch (err) {
      toast.error(t('dashboard.pages.profil.save_error', 'Erreur lors de l\'enregistrement du profil médical.'));
    }
  };

  const updateField = (field: keyof MedicalProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (isProfileLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px] max-w-4xl mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-primary"></div>
      </div>
    );
  }

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
            disabled={saveProfileMutation.isPending}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 active:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-200 cursor-pointer shrink-0"
          >
            <Save className="h-4.5 w-4.5" />
            <span>{saveProfileMutation.isPending ? t('common.saving', 'Enregistrement...') : t('dashboard.pages.profil.save_btn', 'Enregistrer')}</span>
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
