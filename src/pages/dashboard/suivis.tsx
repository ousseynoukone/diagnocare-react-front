import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '../../store/UserStore';
import { useDetailedCheckIns, useSubmitCheckIn } from '../../hooks/useCheckIns';
import { useDetailedPredictions } from '../../hooks/usePredictions';
import { useMLSymptomsMetadata } from '../../hooks/useSymptoms';
import type { FollowUpData, CheckInResponseDTO } from '../../api-s/requests/CheckInRequest';
import FollowUpItem from '../../components/dashboard/followup/FollowUpItem';
import CheckInSymptomModal from '../../components/dashboard/followup/CheckInSymptomModal';
import CheckInResultModal from '../../components/dashboard/followup/CheckInResultModal';

export default function SuivisPage() {
  const { t, i18n } = useTranslation();
  const isFr = i18n.language.startsWith('fr');
  const user = useUserStore((s) => s.user);

  const { data: checkIns = [], isLoading } = useDetailedCheckIns(user?.id);
  const { data: predictions = [] } = useDetailedPredictions(user?.id);
  const { data: mlMetadata } = useMLSymptomsMetadata();
  const submitCheckInMutation = useSubmitCheckIn();

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [activeFollowUp, setActiveFollowUp] = useState<FollowUpData | null>(null);
  const [viewResult, setViewResult] = useState<{ result: CheckInResponseDTO; title: string } | null>(null);

  const pendingList = checkIns.filter((f) => f.status === 'pending' || f.status === 'locked');
  const completedList = checkIns.filter((f) => f.status === 'completed');

  // Derive the current language symptom list for the modal
  const symptoms = useMemo(() => {
    if (!mlMetadata?.symptoms?.en) return [];
    const frList = mlMetadata.symptoms.fr ?? [];
    return mlMetadata.symptoms.en.map((en) => {
      const fr = frList.find((f) => f.id === en.id);
      return { id: en.id, label: isFr ? (fr?.label ?? en.label) : en.label };
    });
  }, [mlMetadata, isFr]);

  // Get original symptom IDs for pre-filling from the corresponding prediction
  const getOriginalSymptomIds = (previousPredictionId: number): string[] => {
    const pred = predictions.find((p) => Number(p.id) === previousPredictionId);
    if (!pred?.symptoms) return [];
    return pred.symptoms
      .split(', ')
      .map((sym) => {
        const trimmed = sym.trim();
        const found = mlMetadata?.symptoms?.en?.find((s) => s.label === trimmed || s.id === trimmed);
        return found?.id ?? trimmed;
      })
      .filter(Boolean);
  };

  const handleCommencer = (followUp: FollowUpData) => {
    if (followUp.status === 'locked') return;
    setActiveFollowUp(followUp);
  };

  const handleVoir = (followUp: FollowUpData) => {
    if (followUp.rawCheckIn.outcome) {
      setViewResult({ result: followUp.rawCheckIn, title: followUp.title });
    }
  };

  const handleSubmit = async (symptomIds: string[]) => {
    if (!activeFollowUp || !user?.id) return;
    const isFrLang = i18n.language.startsWith('fr');
    try {
      const result = await submitCheckInMutation.mutateAsync({
        checkInId: activeFollowUp.rawCheckIn.id,
        userId: user.id,
        previousPredictionId: activeFollowUp.rawCheckIn.previousPredictionId,
        symptomLabels: symptomIds,
      });
      setActiveFollowUp(null);
      setViewResult({ result, title: activeFollowUp.title });
    } catch {
      toast.error(isFrLang ? 'Erreur lors de la soumission du suivi.' : 'Error submitting the follow-up.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px] max-w-7xl mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-primary" />
      </div>
    );
  }

  const tabClass = (active: boolean) =>
    `py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 ${
      active ? 'border-primary text-primary dark:text-primary-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
    }`;
  const countClass = (active: boolean) =>
    `rounded-full px-2 py-0.5 text-xs font-bold ${
      active ? 'bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
    }`;

  return (
    <div className="h-full flex flex-col min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t('dashboard.pages.suivis.title', 'Suivi de santé')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('dashboard.pages.suivis.description', "Gérez vos check-ins réguliers pour surveiller l'évolution de vos symptômes.")}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex gap-8 -mb-px">
          <button onClick={() => setActiveTab('pending')} className={tabClass(activeTab === 'pending')}>
            <span>{t('dashboard.pages.suivis.tab_pending', 'En attente')}</span>
            <span className={countClass(activeTab === 'pending')}>{pendingList.length}</span>
          </button>
          <button onClick={() => setActiveTab('completed')} className={tabClass(activeTab === 'completed')}>
            <span>{t('dashboard.pages.suivis.tab_completed', 'Terminés')}</span>
            <span className={countClass(activeTab === 'completed')}>{completedList.length}</span>
          </button>
        </nav>
      </div>

      {/* List */}
      <div className="space-y-4">
        {activeTab === 'pending' ? (
          pendingList.length > 0 ? (
            <div className="flex flex-col gap-4 animate-fadeIn">
              {pendingList.map((item) => (
                <FollowUpItem
                  key={item.id}
                  title={item.title}
                  status={item.status}
                  statusLabel={item.statusLabel}
                  time={item.time}
                  day={item.day}
                  lockedUntil={item.lockedUntil}
                  onAction={() => handleCommencer(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Clock className="h-12 w-12 stroke-[1.5]" />}
              iconBg="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
              title={t('dashboard.pages.suivis.card_title', 'Aucun suivi actif')}
              desc={t('dashboard.pages.suivis.card_desc', "Vous n'avez pas encore activé de suivi. Lancez une évaluation et activez le suivi depuis les résultats.")}
            />
          )
        ) : (
          completedList.length > 0 ? (
            <div className="flex flex-col gap-4 animate-fadeIn">
              {completedList.map((item) => (
                <FollowUpItem
                  key={item.id}
                  title={item.title}
                  status={item.status}
                  statusLabel={item.statusLabel}
                  time={item.time}
                  day={item.day}
                  onAction={() => handleVoir(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Clock className="h-12 w-12 stroke-[1.5]" />}
              iconBg="bg-slate-50 dark:bg-slate-800/40 text-slate-400"
              title={t('dashboard.pages.suivis.no_completed_title', 'Aucun suivi terminé')}
              desc={t('dashboard.pages.suivis.no_completed_desc', 'Vos suivis terminés apparaîtront ici une fois complétés.')}
            />
          )
        )}
      </div>

      {/* Info box */}
      <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
        <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
          <Info className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
            {t('dashboard.pages.suivis.info_title', 'Pourquoi le suivi est important ?')}
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed max-w-4xl font-medium">
            {t('dashboard.pages.suivis.info_desc', 'Les symptômes évoluent rapidement. Un suivi régulier (toutes les 24h ou 48h) permet à notre IA de détecter précocement toute aggravation et d\'ajuster ses recommandations.')}
          </p>
        </div>
      </div>

      {/* Modals */}
      {activeFollowUp && (
        <CheckInSymptomModal
          isOpen={!!activeFollowUp}
          onClose={() => setActiveFollowUp(null)}
          followUp={activeFollowUp}
          originalSymptomIds={getOriginalSymptomIds(activeFollowUp.rawCheckIn.previousPredictionId)}
          symptoms={symptoms}
          onSubmit={handleSubmit}
          isPending={submitCheckInMutation.isPending}
        />
      )}

      {viewResult && (
        <CheckInResultModal
          isOpen={!!viewResult}
          onClose={() => setViewResult(null)}
          result={viewResult.result}
          diseaseTitle={viewResult.title}
        />
      )}
    </div>
  );
}

function EmptyState({ icon, iconBg, title, desc }: { icon: React.ReactNode; iconBg: string; title: string; desc: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center py-12 space-y-6">
      <div className={`p-4 rounded-full ${iconBg}`}>{icon}</div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
