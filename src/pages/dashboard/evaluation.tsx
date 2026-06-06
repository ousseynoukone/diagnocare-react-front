import { useState, useEffect, useMemo } from 'react';
import { Activity, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import SymptomSelector from '../../components/dashboard/evaluation/SymptomSelector';
import AnalysisLoading from '../../components/dashboard/evaluation/AnalysisLoading';
import EvaluationResult from '../../components/dashboard/evaluation/EvaluationResult';
import SpecialistFinder from '../../components/dashboard/evaluation/SpecialistFinder';
import type { Symptom, PredictionResult, Doctor } from '../../types/models/Evaluation';
import { EvaluationState } from '../../types/models/enums/EvaluationStateEnum';
import { useEvaluationStore } from '../../store/EvaluationStore';
import { useCreatePrediction } from '../../hooks/usePredictions';
import { useUserStore } from '../../store/UserStore';
import { useMLSymptomsMetadata } from '../../hooks/useSymptoms';
import type { PredictionWithResultsResponse } from '../../types/models/Prediction';
import { translateDisease, translateSpecialist } from '../../utils/translationHelper';


const getDoctorsForSpecialist = (specialist: string, lang: string): Doctor[] => {
  const isEn = lang.startsWith('en');
  return [
    {
      name: 'Dr. Sophie Martin',
      specialist: specialist,
      sector: isEn ? 'Tier 1' : 'Secteur 1',
      rating: 4.9,
      reviews: 124,
      address: isEn ? '15 Republic Street, 75001 Paris' : '15 Rue de la République, 75001 Paris',
      nextSlot: isEn ? "Today at 16:30" : "Aujourd'hui à 16:30",
      coords: { x: 120, y: 150 },
      phone: '01 42 27 88 12'
    },
    {
      name: 'Dr. Thomas Dubois',
      specialist: specialist,
      sector: isEn ? 'Tier 1' : 'Secteur 1',
      rating: 4.7,
      reviews: 89,
      address: isEn ? '42 Saint-Germain Boulevard, 75005 Paris' : '42 Boulevard Saint-Germain, 75005 Paris',
      nextSlot: isEn ? 'Tomorrow at 09:00' : 'Demain à 09:00',
      coords: { x: 260, y: 220 },
      phone: '01 45 82 19 33'
    },
    {
      name: 'Dr. Marc Lepitre',
      specialist: specialist,
      sector: isEn ? 'Tier 2' : 'Secteur 2',
      rating: 4.8,
      reviews: 42,
      address: isEn ? '8 Foch Avenue, 75116 Paris' : '8 Avenue Foch, 75116 Paris',
      nextSlot: isEn ? 'Fri Jun 5 at 14:00' : 'Ven 5 Juin à 14:00',
      coords: { x: 70, y: 240 },
      phone: '01 40 56 12 99'
    }
  ];
};

function mapBackendResponse(response: PredictionWithResultsResponse, lang: string): PredictionResult {
  const isFr = lang.startsWith('fr');
  const predictions = response.mlResults?.predictions || [];
  
  if (predictions.length === 0) {
    const defaultSpecialist = isFr ? 'Médecin Généraliste' : 'General Practitioner';
    return {
      title: isFr ? 'Rhume commun / Affection bénigne' : 'Common Cold',
      description: isFr 
        ? 'Infection virale bénigne des voies nasales et de la gorge. Se résout généralement spontanément.'
        : 'Mild viral infection of nose and throat. Usually resolves on its own.',
      confidence: 80,
      specialist: defaultSpecialist,
      urgent: response.prediction?.isRedAlert || false,
      alternatives: [],
      doctors: getDoctorsForSpecialist(defaultSpecialist, lang)
    };
  }

  const primary = predictions[0];
  const rawTitle = isFr ? (primary.disease_fr || primary.disease) : (primary.disease_en || primary.disease);
  const title = translateDisease(rawTitle, lang);
  
  const rawSpecialist = isFr ? (primary.specialist_fr || primary.specialist) : (primary.specialist_en || primary.specialist);
  const specialist = translateSpecialist(rawSpecialist, lang);
  
  const description = primary.description || '';
  
  let confidence = primary.probability ?? 80;
  if (confidence <= 1.0) {
    confidence = confidence * 100;
  }
  confidence = Math.round(confidence);

  let specialistConfidence = primary.specialist_probability ?? 0;
  if (specialistConfidence > 0 && specialistConfidence <= 1.0) {
    specialistConfidence = specialistConfidence * 100;
  }
  specialistConfidence = Math.round(specialistConfidence);

  const alternatives = predictions.slice(1).map((alt: any) => {
    let score = alt.probability ?? 50;
    if (score <= 1.0) {
      score = score * 100;
    }
    score = Math.round(score);
    const rawName = isFr ? (alt.disease_fr || alt.disease) : (alt.disease_en || alt.disease);
    return {
      name: translateDisease(rawName, lang),
      score
    };
  }).sort((a: any, b: any) => b.score - a.score);

  const allPossibilities = predictions.map((pred: any, index: number) => {
    const rawPTitle = isFr ? (pred.disease_fr || pred.disease) : (pred.disease_en || pred.disease);
    const rawPSpecialist = isFr ? (pred.specialist_fr || pred.specialist) : (pred.specialist_en || pred.specialist);
    const pTitle = translateDisease(rawPTitle, lang);
    const pSpecialist = translateSpecialist(rawPSpecialist, lang);
    const pDescription = pred.description || '';
    
    let pConfidence = pred.probability ?? 80;
    if (pConfidence <= 1.0) {
      pConfidence = pConfidence * 100;
    }
    pConfidence = Math.round(pConfidence);

    let pSpecialistConfidence = pred.specialist_probability ?? 0;
    if (pSpecialistConfidence > 0 && pSpecialistConfidence <= 1.0) {
      pSpecialistConfidence = pSpecialistConfidence * 100;
    }
    pSpecialistConfidence = Math.round(pSpecialistConfidence);

    return {
      title: pTitle,
      description: pDescription,
      confidence: pConfidence,
      specialist: pSpecialist,
      specialistConfidence: pSpecialistConfidence,
      isPrimary: index === 0
    };
  });

  const rawProfile = response.mlResults?.metadata?.profile_used;
  const profileUsed: Record<string, string> = {};
  if (rawProfile) {
    Object.entries(rawProfile).forEach(([key, val]) => {
      profileUsed[key] = String(val);
    });
  }

  return {
    id: response.prediction?.id,
    title,
    description,
    confidence,
    specialist,
    specialistConfidence,
    urgent: response.prediction?.isRedAlert || false,
    alternatives,
    doctors: getDoctorsForSpecialist(specialist, lang),
    profileUsed,
    allPossibilities
  };
}

export default function EvaluationPage() {
  const { t, i18n } = useTranslation();
  
  const evaluationState = useEvaluationStore((state) => state.evaluationState);
  const setEvaluationState = useEvaluationStore((state) => state.setEvaluationState);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [resultData, setResultData] = useState<PredictionResult | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('');

  const user = useUserStore((state) => state.user);
  const { mutateAsync: createPrediction } = useCreatePrediction();
  const { data: mlMetadata, isLoading: isLoadingSymptoms } = useMLSymptomsMetadata();

  // Map ML symptoms list dynamically based on active language translations
  const allSymptoms: Symptom[] = useMemo(() => {
    if (!mlMetadata?.symptoms?.en) return [];
    
    return mlMetadata.symptoms.en.map((enItem) => {
      const frItem = mlMetadata.symptoms.fr?.find(fr => fr.id === enItem.id);
      const isFr = i18n.language.startsWith('fr');
      
      return {
        id: enItem.id,
        label: isFr ? (frItem?.label || enItem.label) : enItem.label,
        en: enItem.label,
      };
    });
  }, [mlMetadata, i18n.language]);

  // Compute frequent symptoms that exist in the loaded metadata
  const frequentSymptomIds = useMemo(() => {
    const DEFAULT_FREQUENT_IDS = [
      'fever',
      'headache',
      'cough',
      'fatigue',
      'nausea',
      'chest_pain',
      'dizziness',
      'throat_irritation',
      'breathlessness',
    ];
    return DEFAULT_FREQUENT_IDS.filter(id => allSymptoms.some(s => s.id === id));
  }, [allSymptoms]);

  // Handle symptom toggling
  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Trigger analysis state transition and API call
  const handleStartAnalysis = async () => {
    if (selectedSymptoms.length === 0 || !user?.id) return;
    setEvaluationState(EvaluationState.LOADING);
    try {
      const response = await createPrediction({
        userId: user.id,
        symptomLabels: selectedSymptoms,
      });
      const mapped = mapBackendResponse(response, i18n.language);
      
      const translatedSymptoms = selectedSymptoms.map(id => {
        const found = allSymptoms.find(s => s.id === id);
        return found ? found.label : id;
      });
      mapped.symptoms = translatedSymptoms;

      setResultData(mapped);
      setEvaluationState(EvaluationState.RESULT);
    } catch (error) {
      console.error('Failed to create prediction:', error);
      const errorMsg = t('dashboard.pages.evaluation.error_message', 'Une erreur est survenue lors de l’analyse. Veuillez réessayer.');
      toast.error(errorMsg);
      setEvaluationState(EvaluationState.SELECTION);
    }
  };

  // If page reloads and state is RESULT/LOADING/SEARCH_SPECIALIST but resultData is null,
  // we reset evaluationState to SELECTION
  useEffect(() => {
    if (evaluationState !== EvaluationState.START && evaluationState !== EvaluationState.SELECTION && !resultData) {
      setEvaluationState(EvaluationState.SELECTION);
    }
  }, [evaluationState, resultData]);

  // Show a premium loading spinner while fetching the symptoms list from the backend
  if (isLoadingSymptoms) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px] max-w-6xl mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-primary"></div>
      </div>
    );
  }

  return (
    <div id="evaluation-page" className="space-y-6  max-w-6xl mx-auto pb-24 text-slate-800 dark:text-slate-100">
      
      {/* State 0: Welcome start view */}
      {evaluationState === EvaluationState.START && (
        <div className="space-y-15 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t('dashboard.pages.evaluation.title', 'Nouvelle Évaluation')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t('dashboard.pages.evaluation.description', 'Commencez une nouvelle analyse de vos symptômes assistée par notre intelligence artificielle.')}
            </p>
          </div>

          <div className="flex justify-center w-full">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm max-w-2xl w-full">
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
                  onClick={() => setEvaluationState(EvaluationState.SELECTION)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-primary/25 transition-all duration-200 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-white" />
                  {t('dashboard.pages.evaluation.start_button', "Lancer l'évaluation")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* State 1: Symptom Selection */}
      {evaluationState === EvaluationState.SELECTION && (
        <SymptomSelector 
          selectedSymptoms={selectedSymptoms}
          onToggleSymptom={toggleSymptom}
          onStartAnalysis={handleStartAnalysis}
          allSymptoms={allSymptoms}
          frequentSymptomIds={frequentSymptomIds}
        />
      )}

      {/* State 2: Analysis loading state */}
      {evaluationState === EvaluationState.LOADING && (
        <AnalysisLoading />
      )}

      {/* State 3: Diagnostic prediction result */}
      {evaluationState === EvaluationState.RESULT && resultData && (
        <EvaluationResult 
          resultData={resultData}
          onBackToSelection={() => setEvaluationState(EvaluationState.SELECTION)}
          onFindSpecialists={(specName) => {
            setSelectedSpecialist(specName);
            setEvaluationState(EvaluationState.SEARCH_SPECIALIST);
          }}
        />
      )}

      {/* State 4: Recommended specialist and locator map */}
      {evaluationState === EvaluationState.SEARCH_SPECIALIST && resultData && (
        <SpecialistFinder 
          specialist={selectedSpecialist || resultData.specialist}
          doctors={getDoctorsForSpecialist(selectedSpecialist || resultData.specialist, i18n.language)}
          onBackToResults={() => setEvaluationState(EvaluationState.RESULT)}
        />
      )}

    </div>
  );
}
