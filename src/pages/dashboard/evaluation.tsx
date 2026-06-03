import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SymptomSelector from '../../components/dashboard/evaluation/SymptomSelector';
import AnalysisLoading from '../../components/dashboard/evaluation/AnalysisLoading';
import EvaluationResult from '../../components/dashboard/evaluation/EvaluationResult';
import SpecialistFinder from '../../components/dashboard/evaluation/SpecialistFinder';
import type { Symptom, Doctor, PredictionResult } from '../../types/models/Evaluation';

// Symptom data definition matching database labels
const ALL_SYMPTOMS: Symptom[] = [
  { id: 'fever', label: 'Fièvre', en: 'Fever' },
  { id: 'headache', label: 'Maux de tête', en: 'Headache' },
  { id: 'cough', label: 'Toux', en: 'Cough' },
  { id: 'fatigue', label: 'Fatigue', en: 'Fatigue' },
  { id: 'nausea', label: 'Nausées', en: 'Nausea' },
  { id: 'chest_pain', label: 'Douleur thoracique', en: 'Chest pain' },
  { id: 'dizziness', label: 'Vertiges', en: 'Vertigo / Dizziness' },
  { id: 'throat_irritation', label: 'Mal de gorge', en: 'Sore throat' },
  { id: 'breathlessness', label: 'Essoufflement', en: 'Shortness of breath' },
  { id: 'itching', label: 'Démangeaisons', en: 'Itching' },
  { id: 'vomiting', label: 'Vomissements', en: 'Vomiting' },
  { id: 'loss_of_appetite', label: "Perte d'appétit", en: 'Loss of appetite' },
  { id: 'abdominal_pain', label: 'Douleur abdominale', en: 'Abdominal pain' },
  { id: 'muscle_pain', label: 'Courbatures / Douleurs musculaires', en: 'Muscle pain' },
  { id: 'continuous_sneezing', label: 'Éternuements continus', en: 'Continuous sneezing' },
  { id: 'runny_nose', label: 'Nez qui coule', en: 'Runny nose' },
  { id: 'sweating', label: 'Transpiration', en: 'Sweating' },
  { id: 'chills', label: 'Frissons', en: 'Chills' },
];

const FREQUENT_SYMPTOM_IDS = [
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

// Generate dynamic predictions based on selected symptoms
const getPredictionResult = (selectedIds: string[]): PredictionResult => {
  const selected = new Set(selectedIds);
  
  // Case 1: Migraine
  if (selected.has('headache') && (selected.has('dizziness') || selected.has('nausea') || selected.has('throat_irritation') || selected.has('breathlessness') || selected.has('fatigue'))) {
    return {
      title: 'Migraine avec aura',
      description: 'Maux de tête intenses souvent accompagnés de troubles visuels ou sensoriels temporaires, de nausées ou de vertiges.',
      confidence: 88,
      specialist: 'Neurologue',
      alternatives: [
        { name: 'Céphalée de tension', score: 45 },
        { name: 'Sinusite aiguë', score: 12 }
      ],
      doctors: [
        {
          name: 'Dr. Sophie Martin',
          specialist: 'Neurologue',
          sector: 'Secteur 1',
          rating: 4.9,
          reviews: 124,
          address: '15 Rue de la République, 75001 Paris',
          nextSlot: "Aujourd'hui à 16:30",
          coords: { x: 120, y: 150 },
          phone: '01 42 27 88 12'
        },
        {
          name: 'Dr. Thomas Dubois',
          specialist: 'Neurologue',
          sector: 'Secteur 1',
          rating: 4.7,
          reviews: 89,
          address: '42 Boulevard Saint-Germain, 75005 Paris',
          nextSlot: 'Demain à 09:00',
          coords: { x: 260, y: 220 },
          phone: '01 45 82 19 33'
        },
        {
          name: 'Dr. Marc Lepitre',
          specialist: 'Neurologue',
          sector: 'Secteur 2',
          rating: 4.8,
          reviews: 42,
          address: '8 Avenue Foch, 75116 Paris',
          nextSlot: 'Ven 5 Juin à 14:00',
          coords: { x: 60, y: 180 },
          phone: '01 40 56 12 99'
        },
        {
          name: 'Dr. Catherine Vasseur',
          specialist: 'Neurologue',
          sector: 'Secteur 1',
          rating: 4.6,
          reviews: 73,
          address: '112 Boulevard de Sébastopol, 75003 Paris',
          nextSlot: 'Lun 8 Juin à 10:15',
          coords: { x: 220, y: 90 },
          phone: '01 48 04 77 15'
        }
      ]
    };
  }
  
  // Case 2: Cardiac warning
  if (selected.has('chest_pain') || (selected.has('breathlessness') && selected.has('sweating'))) {
    return {
      title: 'Angine de poitrine / Suspicion Cardiaque',
      description: 'Douleur ou inconfort thoracique causé par un manque d’irrigation sanguine du muscle cardiaque. Nécessite un avis médical rapide.',
      confidence: 78,
      specialist: 'Cardiologue',
      urgent: true,
      alternatives: [
        { name: 'Reflux gastro-œsophagien (RGO)', score: 38 },
        { name: 'Crise d’angoisse / Spasmophilie', score: 25 }
      ],
      doctors: [
        {
          name: 'Dr. Antoine Lemaire',
          specialist: 'Cardiologue',
          sector: 'Secteur 1',
          rating: 4.9,
          reviews: 215,
          address: '88 Rue de Rivoli, 75004 Paris',
          nextSlot: "Aujourd'hui à 17:15",
          coords: { x: 190, y: 140 },
          phone: '01 42 77 22 44'
        },
        {
          name: 'Dr. Sarah Bendayan',
          specialist: 'Cardiologue',
          sector: 'Secteur 2',
          rating: 4.8,
          reviews: 134,
          address: '14 Avenue de Suffren, 75015 Paris',
          nextSlot: 'Demain à 11:30',
          coords: { x: 70, y: 240 },
          phone: '01 45 78 90 12'
        },
        {
          name: 'Dr. Philippe Rousseau',
          specialist: 'Cardiologue',
          sector: 'Secteur 1',
          rating: 4.6,
          reviews: 98,
          address: '27 Rue du Faubourg Saint-Honoré, 75008 Paris',
          nextSlot: 'Lun 8 Juin à 09:00',
          coords: { x: 100, y: 80 },
          phone: '01 44 56 30 00'
        }
      ]
    };
  }

  // Case 3: Viral infection
  if (selected.has('fever') || selected.has('cough') || selected.has('throat_irritation') || selected.has('runny_nose')) {
    return {
      title: 'Infection respiratoire aiguë (type Rhume/Grippe)',
      description: 'Infection virale des voies respiratoires supérieures accompagnée de toux, congestion, irritation et fatigue générale.',
      confidence: 92,
      specialist: 'Pneumologue',
      alternatives: [
        { name: 'Rhume commun / Rhinopharyngite', score: 68 },
        { name: 'Bronchite aiguë', score: 35 }
      ],
      doctors: [
        {
          name: 'Dr. Claire Dupuis',
          specialist: 'Pneumologue',
          sector: 'Secteur 1',
          rating: 4.8,
          reviews: 95,
          address: '62 Boulevard de Port-Royal, 75005 Paris',
          nextSlot: "Aujourd'hui à 15:45",
          coords: { x: 230, y: 280 },
          phone: '01 40 27 15 30'
        },
        {
          name: 'Dr. Jean-Pierre Roche',
          specialist: 'Pneumologue',
          sector: 'Secteur 1',
          rating: 4.7,
          reviews: 110,
          address: '18 Rue de Charenton, 75012 Paris',
          nextSlot: 'Demain à 10:00',
          coords: { x: 310, y: 190 },
          phone: '01 43 44 20 20'
        },
        {
          name: 'Dr. Emilie Roux',
          specialist: 'Pneumologue',
          sector: 'Secteur 2',
          rating: 4.9,
          reviews: 58,
          address: '5 Avenue Carnot, 75017 Paris',
          nextSlot: 'Jeu 4 Juin à 11:30',
          coords: { x: 50, y: 70 },
          phone: '01 42 67 11 00'
        }
      ]
    };
  }

  // Case 4: Default generic response
  return {
    title: 'Rhume commun / Affection bénigne',
    description: 'Infection virale bénigne des voies nasales et de la gorge. Se résout généralement spontanément avec du repos et une bonne hydratation.',
    confidence: 85,
    specialist: 'Médecin Généraliste',
    alternatives: [
      { name: 'Allergie saisonnière', score: 40 },
      { name: 'Fatigue passagère', score: 18 }
    ],
    doctors: [
      {
        name: 'Dr. Sophie Martin',
        specialist: 'Médecin Généraliste',
        sector: 'Secteur 1',
        rating: 4.9,
        reviews: 320,
        address: '15 Rue de la République, 75001 Paris',
        nextSlot: "Aujourd'hui à 16:30",
        coords: { x: 120, y: 150 },
        phone: '01 42 27 88 12'
      },
      {
        name: 'Dr. Thomas Dubois',
        specialist: 'Médecin Généraliste',
        sector: 'Secteur 1',
        rating: 4.7,
        reviews: 245,
        address: '42 Boulevard Saint-Germain, 75005 Paris',
        nextSlot: 'Demain à 09:00',
        coords: { x: 260, y: 220 },
        phone: '01 45 82 19 33'
      }
    ]
  };
};

export default function EvaluationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // App state workflow: 'start' | 'selection' | 'loading' | 'result' | 'search_specialist'
  const [step, setStep] = useState<'start' | 'selection' | 'loading' | 'result' | 'search_specialist'>('start');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  // Handle symptom toggling
  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Trigger analysis state transition
  const handleStartAnalysis = () => {
    if (selectedSymptoms.length === 0) return;
    setStep('loading');
  };

  // Handle loading state timeout
  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => {
        setStep('result');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Compute prediction results based on selection
  const resultData = useMemo(() => getPredictionResult(selectedSymptoms), [selectedSymptoms]);

  return (
    <div id="evaluation-page" className="space-y-6 max-w-6xl mx-auto pb-24 text-slate-800 dark:text-slate-100">
      
      {/* State 0: Welcome start view */}
      {step === 'start' && (
        <div className="space-y-6 max-w-4xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t('dashboard.pages.evaluation.title', 'Nouvelle Évaluation')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t('dashboard.pages.evaluation.description', 'Commencez une nouvelle analyse de vos symptômes assistée par notre intelligence artificielle.')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
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
                onClick={() => setStep('selection')}
                className="flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-primary/25 transition-all duration-200 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-white" />
                {t('dashboard.pages.evaluation.start_button', "Lancer l'évaluation")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 1: Symptom Selection */}
      {step === 'selection' && (
        <SymptomSelector 
          selectedSymptoms={selectedSymptoms}
          onToggleSymptom={toggleSymptom}
          onStartAnalysis={handleStartAnalysis}
          allSymptoms={ALL_SYMPTOMS}
          frequentSymptomIds={FREQUENT_SYMPTOM_IDS}
        />
      )}

      {/* State 2: Analysis loading state */}
      {step === 'loading' && (
        <AnalysisLoading />
      )}

      {/* State 3: Diagnostic prediction result */}
      {step === 'result' && (
        <EvaluationResult 
          resultData={resultData}
          onBackToSelection={() => setStep('selection')}
          onFindSpecialists={() => setStep('search_specialist')}
          onNavigateToFollowups={() => {
            navigate('/dashboard/suivis');
          }}
        />
      )}

      {/* State 4: Recommended specialist and locator map */}
      {step === 'search_specialist' && (
        <SpecialistFinder 
          specialist={resultData.specialist}
          doctors={resultData.doctors}
          onBackToResults={() => setStep('result')}
        />
      )}

    </div>
  );
}
