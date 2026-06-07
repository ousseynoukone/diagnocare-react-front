import { useQuery } from '@tanstack/react-query';
import { X, AlertTriangle, Activity, Stethoscope, Tag, User } from 'lucide-react';
import {
  getPredictionDetail,
  getPathologyResults,
  getSessionSymptomDetail,
  getPatientMedicalProfile,
} from '../../api-s/requests/AdminRequest';

// Convert snake_case symptom keys to readable labels
const SYMPTOM_LABELS: Record<string, string> = {
  chest_pain: 'Douleur thoracique',
  breathlessness: 'Essoufflement',
  throat_irritation: 'Irritation de la gorge',
  fatigue: 'Fatigue',
  fever: 'Fièvre',
  cough: 'Toux',
  headache: 'Mal de tête',
  nausea: 'Nausée',
  vomiting: 'Vomissements',
  diarrhea: 'Diarrhée',
  abdominal_pain: 'Douleur abdominale',
  back_pain: 'Douleur dorsale',
  joint_pain: 'Douleur articulaire',
  muscle_pain: 'Douleur musculaire',
  skin_rash: 'Éruption cutanée',
  itching: 'Démangeaisons',
  weight_loss: 'Perte de poids',
  weight_gain: 'Prise de poids',
  loss_of_appetite: "Perte d'appétit",
  excessive_thirst: 'Soif excessive',
  frequent_urination: 'Mictions fréquentes',
  blurred_vision: 'Vision floue',
  dizziness: 'Vertiges',
  fainting: 'Évanouissement',
  palpitations: 'Palpitations',
  swelling: 'Gonflement',
  runny_nose: 'Nez qui coule',
  sore_throat: 'Mal de gorge',
  sneezing: 'Éternuements',
  high_fever: 'Forte fièvre',
  chills: 'Frissons',
  sweating: 'Transpiration',
  night_sweats: 'Sueurs nocturnes',
  shortness_of_breath: 'Difficultés respiratoires',
  chest_tightness: 'Oppression thoracique',
  wheezing: 'Respiration sifflante',
  bloody_sputum: 'Crachats sanglants',
  loss_of_smell: 'Perte de l\'odorat',
  loss_of_taste: 'Perte du goût',
  confusion: 'Confusion',
  anxiety: 'Anxiété',
  depression: 'Dépression',
  insomnia: 'Insomnie',
  neck_pain: 'Douleur cervicale',
  stiff_neck: 'Raideur de la nuque',
  swollen_lymph_nodes: 'Ganglions enflés',
  yellowing_of_skin: 'Jaunissement de la peau',
  dark_urine: 'Urine foncée',
  pale_stool: 'Selles pâles',
  bloody_stool: 'Selles sanglantes',
  constipation: 'Constipation',
  indigestion: 'Indigestion',
  heartburn: 'Brûlures d\'estomac',
  leg_pain: 'Douleur aux jambes',
  cold_feet: 'Pieds froids',
  numbness: 'Engourdissement',
  weakness: 'Faiblesse',
  tremors: 'Tremblements',
};

function formatSymptomLabel(raw: string): string {
  if (SYMPTOM_LABELS[raw]) return SYMPTOM_LABELS[raw];
  // Fallback: replace underscores with spaces and capitalize each word
  return raw
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const color =
    pct >= 70 ? 'bg-red-500' : pct >= 40 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold tabular-nums w-14 text-right text-slate-700 dark:text-slate-300">
        {pct.toFixed(2)}%
      </span>
    </div>
  );
}

export default function PredictionDetailModal({
  predictionId,
  onClose,
}: {
  predictionId: number;
  onClose: () => void;
}) {
  const { data: prediction, isLoading: loadingPred } = useQuery({
    queryKey: ['admin-prediction-detail', predictionId],
    queryFn: () => getPredictionDetail(predictionId),
    staleTime: 60_000,
  });

  const { data: results = [], isLoading: loadingResults } = useQuery({
    queryKey: ['admin-pathology-results', predictionId],
    queryFn: () => getPathologyResults(predictionId),
    staleTime: 60_000,
  });

  const { data: session, isLoading: loadingSession } = useQuery({
    queryKey: ['admin-session-symptom', prediction?.sessionSymptomId],
    queryFn: () => getSessionSymptomDetail(prediction!.sessionSymptomId!),
    enabled: !!prediction?.sessionSymptomId,
    staleTime: 60_000,
  });

  const { data: medicalProfile } = useQuery({
    queryKey: ['admin-medical-profile', session?.userId],
    queryFn: () => getPatientMedicalProfile(session!.userId!),
    enabled: !!session?.userId,
    staleTime: 60_000,
    retry: false,
  });

  const isLoading = loadingPred || loadingResults || loadingSession;

  const sortedResults = [...results].sort(
    (a, b) => (b.diseaseScore ?? 0) - (a.diseaseScore ?? 0),
  );

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 dark:bg-violet-950/40 rounded-xl">
              <Activity className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Prédiction #{predictionId}
              </h2>
              {prediction && (
                <p className="text-xs text-slate-400">{formatDate(prediction.createdAt)}</p>
              )}
            </div>
            {prediction?.isRedAlert && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 px-2.5 py-1 rounded-lg">
                <AlertTriangle className="h-3 w-3" /> Alerte rouge
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-violet-500 dark:border-slate-800 dark:border-t-violet-500" />
            </div>
          ) : (
            <>
              {/* Summary row */}
              {prediction && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400 font-medium">Meilleur score</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {prediction.bestScore != null
                        ? `${Number(prediction.bestScore).toFixed(2)}%`
                        : '—'}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400 font-medium">Maladies détectées</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {sortedResults.length}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                    <p className="text-xs text-slate-400 font-medium">Symptômes</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {session?.symptoms?.length ?? '—'}
                    </p>
                  </div>
                </div>
              )}

              {/* Symptoms */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5" /> Symptômes saisis
                </h3>
                {!session ? (
                  <p className="text-sm text-slate-400 italic">Données non disponibles</p>
                ) : session.symptoms.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Aucun symptôme enregistré</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {session.symptoms.map((s) => (
                      <span
                        key={s.id}
                        className="text-xs font-semibold bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50 px-3 py-1.5 rounded-xl"
                      >
                        {formatSymptomLabel(s.label)}
                      </span>
                    ))}
                  </div>
                )}
                {session?.rawDescription && (
                  <p className="text-xs text-slate-400 mt-2 italic">
                    Description : {session.rawDescription}
                  </p>
                )}
              </div>

              {/* Patient medical profile */}
              {medicalProfile && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Profil médical du patient
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {medicalProfile.age != null && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Âge</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{medicalProfile.age} ans</p>
                      </div>
                    )}
                    {medicalProfile.gender != null && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Genre</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {medicalProfile.gender === 'MALE' ? 'Homme' : medicalProfile.gender === 'FEMALE' ? 'Femme' : medicalProfile.gender}
                        </p>
                      </div>
                    )}
                    {medicalProfile.weight != null && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Poids</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{medicalProfile.weight} kg</p>
                      </div>
                    )}
                    {medicalProfile.bmi != null && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">IMC</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{medicalProfile.bmi}</p>
                      </div>
                    )}
                    {medicalProfile.meanBloodPressure != null && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tension art.</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{medicalProfile.meanBloodPressure} mmHg</p>
                      </div>
                    )}
                    {medicalProfile.meanCholesterol != null && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cholestérol</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{medicalProfile.meanCholesterol} mg/dL</p>
                      </div>
                    )}
                  </div>
                  {/* Lifestyle flags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {medicalProfile.isSmoking && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 px-2.5 py-1 rounded-lg">
                        Fumeur
                      </span>
                    )}
                    {medicalProfile.alcohol && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 px-2.5 py-1 rounded-lg">
                        Alcool
                      </span>
                    )}
                    {medicalProfile.sedentary && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
                        Sédentaire
                      </span>
                    )}
                    {medicalProfile.familyAntecedents && medicalProfile.familyAntecedents.length > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 px-2.5 py-1 rounded-lg">
                        Antécédents familiaux
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Disease scores */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <Stethoscope className="h-3.5 w-3.5" /> Résultats ML
                  {sortedResults.length > 0 && (
                    <span className="text-[10px] normal-case font-normal">(classés par score décroissant)</span>
                  )}
                </h3>
                {sortedResults.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Aucun résultat ML disponible</p>
                ) : (
                  <div className="space-y-3">
                    {sortedResults.map((r, i) => {
                      const name = r.localizedDiseaseName || r.pathologyName || `Maladie #${r.id}`;
                      const specialist = r.localizedSpecialistLabel || r.doctorSpecialistLabel;
                      return (
                        <div key={r.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 w-5 text-right shrink-0">
                              {i + 1}.
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {name}
                                </span>
                                {specialist && (
                                  <span className="text-[10px] text-slate-400 shrink-0">{specialist}</span>
                                )}
                              </div>
                              <ScoreBar score={r.diseaseScore ?? 0} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Comment */}
              {prediction?.comment && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Commentaire
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                    {prediction.comment}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
