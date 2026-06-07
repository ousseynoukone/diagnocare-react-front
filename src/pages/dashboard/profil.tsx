import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Save, AlertTriangle } from 'lucide-react';
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

  const isProfileIncomplete = !dbProfile || 
                              !dbProfile.age || 
                              dbProfile.age === 0 || 
                              !dbProfile.weight || 
                              dbProfile.weight === 0 || 
                              !dbProfile.gender;

  // Sync state when dbProfile is loaded/updated
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    let currentProfile = DEFAULT_PROFILE;
    if (saved) {
      try {
        currentProfile = { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse saved profile:', e);
      }
    }

    if (dbProfile) {
      currentProfile = {
        ...currentProfile,
        age: dbProfile.age ? String(dbProfile.age) : (currentProfile.age || ''),
        sexe: dbProfile.gender === 'FEMALE' ? 'Femme' : (dbProfile.gender === 'MALE' ? 'Homme' : (currentProfile.sexe || 'Homme')),
        poids: dbProfile.weight ? String(dbProfile.weight) : (currentProfile.poids || ''),
        taille: (dbProfile.bmi && dbProfile.weight ? String(Math.round(Math.sqrt(dbProfile.weight / dbProfile.bmi) * 100)) : '') || currentProfile.taille || '',
        tension: dbProfile.meanBloodPressure ? String(Math.round(dbProfile.meanBloodPressure / 10)) : (currentProfile.tension || ''),
        cholesterol: dbProfile.meanCholesterol ? (dbProfile.meanCholesterol / 100).toFixed(2) : (currentProfile.cholesterol || ''),
        antecedents: dbProfile.familyAntecedents && dbProfile.familyAntecedents.length > 0 ? dbProfile.familyAntecedents.join(', ') : (currentProfile.antecedents || ''),
        tabac: dbProfile.isSmoking !== undefined ? (dbProfile.isSmoking ? 'oui' : 'non') : (currentProfile.tabac || 'non'),
        alcool: dbProfile.alcohol !== undefined ? (dbProfile.alcohol ? (currentProfile.alcool !== 'jamais' ? currentProfile.alcool : 'occasionnelle') : 'jamais') : (currentProfile.alcool || 'jamais'),
        activite: dbProfile.sedentary !== undefined ? (dbProfile.sedentary ? 'Sédentaire (peu ou pas de sport)' : (currentProfile.activite !== 'Sédentaire (peu ou pas de sport)' ? currentProfile.activite : 'Actif (1-3 séances de sport/semaine)')) : (currentProfile.activite || 'Sédentaire (peu ou pas de sport)'),
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

    // Convert and Validate Inputs
    const age = parseInt(profile.age);
    if (isNaN(age) || age < 1 || age > 120) {
      toast.error(t('dashboard.pages.profil.validation.age', "L'âge doit être compris entre 1 et 120 ans."));
      return;
    }

    const weight = parseFloat(profile.poids);
    if (isNaN(weight) || weight < 2 || weight > 300) {
      toast.error(t('dashboard.pages.profil.validation.weight', "Le poids doit être compris entre 2 et 300 kg."));
      return;
    }

    const heightCm = parseFloat(profile.taille);
    if (isNaN(heightCm) || heightCm < 30 || heightCm > 250) {
      toast.error(t('dashboard.pages.profil.validation.height', "La taille doit être comprise entre 30 et 250 cm."));
      return;
    }

    const gender = profile.sexe === 'Femme' ? GenderEnum.FEMALE : (profile.sexe === 'Homme' ? GenderEnum.MALE : null);

    // Calculate BMI
    const heightM = heightCm / 100;
    const bmi = weight && heightM ? Math.round(weight / (heightM * heightM)) : 0;

    const tensionValue = profile.tension.trim();
    const cholesterolValue = profile.cholesterol.trim();
    const antecedentsValue = profile.antecedents.trim();

    // Parse and validate blood pressure (systolic/diastolic) only if entered
    let meanBloodPressure: number | undefined;
    if (tensionValue) {
      const tensionRegex = /^\d{1,3}\/\d{1,3}$/;
      if (!tensionRegex.test(tensionValue)) {
        toast.error(t('dashboard.pages.profil.validation.tension_format', "La tension doit être au format Systolique/Diastolique (ex: 12/8 ou 120/80)."));
        return;
      }
      const parts = tensionValue.split('/');
      const sys = parseFloat(parts[0]) || 0;
      const dia = parseFloat(parts[1]) || 0;
      
      const normSys = sys <= 20 ? sys * 10 : sys;
      const normDia = dia <= 20 ? dia * 10 : dia;

      if (normSys < 50 || normSys > 250) {
        toast.error(t('dashboard.pages.profil.validation.sys_value', "La tension systolique doit être comprise entre 50 et 250 mmHg."));
        return;
      }
      if (normDia < 30 || normDia > 150) {
        toast.error(t('dashboard.pages.profil.validation.dia_value', "La tension diastolique doit être comprise entre 30 et 150 mmHg."));
        return;
      }
      meanBloodPressure = normSys;
    }

    // Parse and validate cholesterol only if entered
    let meanCholesterol: number | undefined;
    if (cholesterolValue) {
      const rawChol = parseFloat(cholesterolValue);
      if (isNaN(rawChol) || rawChol <= 0) {
        toast.error(t('dashboard.pages.profil.validation.chol_invalid', "Veuillez entrer une valeur de cholestérol valide."));
        return;
      }
      const normChol = rawChol > 10 ? rawChol : rawChol * 100;
      if (normChol < 50 || normChol > 500) {
        toast.error(t('dashboard.pages.profil.validation.chol_value', "Le cholestérol doit être compris entre 0.50 et 5.00 g/L (50 et 500 mg/dL)."));
        return;
      }
      meanCholesterol = normChol;
    }

    const sedentary = profile.activite.includes('Sédentaire');
    const isSmoking = profile.tabac === 'oui';
    const alcohol = profile.alcool !== 'jamais';
    const familyAntecedents = antecedentsValue
      ? antecedentsValue.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (!gender) {
      toast.error(t('dashboard.pages.profil.validation.gender', 'Veuillez sélectionner un sexe biologique (Homme ou Femme).'));
      return;
    }

    const requestPayload = {
      userId: user.id,
      age,
      gender,
      weight,
      meanBloodPressure,
      meanCholesterol,
      sedentary,
      bmi,
      alcohol,
      isSmoking,
      familyAntecedents,
    };

    // Save to local storage for local detail retention (e.g. height, specific activity string)
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));

    try {
      await saveProfileMutation.mutateAsync(requestPayload);
      toast.success(t('dashboard.pages.profil.save_success', 'Profil médical enregistré avec succès !'));
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message;
      if (err?.response?.status === 404 && apiMessage?.includes('User not found')) {
        toast.error(t('dashboard.pages.profil.save_error_stale_session', 'Session expirée ou compte introuvable. Déconnectez-vous puis reconnectez-vous.'));
        return;
      }
      toast.error(apiMessage || t('dashboard.pages.profil.save_error', 'Erreur lors de l\'enregistrement du profil médical.'));
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

        {/* Profile Incomplete Warning Banner */}
        {isProfileIncomplete && (
          <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5 flex items-start gap-3.5 shadow-sm animate-pulse">
            <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                {t('dashboard.pages.profil.incomplete_title', 'Profil médical obligatoire')}
              </h4>
              <p className="text-xs sm:text-sm text-amber-705 dark:text-amber-400 leading-relaxed mt-1 font-semibold">
                {t('dashboard.pages.profil.incomplete_desc', 'Veuillez renseigner et enregistrer les informations obligatoires : Âge, Sexe biologique, Poids et Taille. Les indicateurs de santé sont optionnels.')}
              </p>
            </div>
          </div>
        )}

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
