export interface HistoryRecord {
  id: string;
  title: string;
  specialist: string;
  date: string;
  confidence: number;
  alert: boolean;
  monthFilter: boolean;
  symptoms?: string;
}

export interface FollowUpData {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  statusLabel: string;
  time: string;
  day: string;
}

const HISTORY_KEY = 'diagnocare-local-history';
const FOLLOWUP_KEY = 'diagnocare-local-followup';

const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 'h-1',
    title: 'Migraine avec aura',
    specialist: 'Neurologue',
    date: '12 Oct 2023',
    confidence: 88,
    alert: false,
    monthFilter: true,
    symptoms: 'Maux de tête, fièvre légère',
  },
  {
    id: 'h-2',
    title: 'Entorse cheville',
    specialist: 'Médecin du sport',
    date: '05 Oct 2023',
    confidence: 92,
    alert: false,
    monthFilter: true,
    symptoms: 'Douleur cheville, gonflement',
  },
  {
    id: 'h-3',
    title: 'Infection virale',
    specialist: 'Généraliste',
    date: '28 Sept 2023',
    confidence: 78,
    alert: false,
    monthFilter: false,
    symptoms: 'Toux sèche, fatigue',
  },
  {
    id: 'h-4',
    title: 'Douleur thoracique',
    specialist: 'Cardiologue',
    date: '15 Sept 2023',
    confidence: 95,
    alert: true,
    monthFilter: false,
    symptoms: 'Douleur thoracique, essoufflement',
  },
  {
    id: 'h-5',
    title: 'Grippe saisonnière',
    specialist: 'Généraliste',
    date: '02 Sept 2023',
    confidence: 82,
    alert: false,
    monthFilter: false,
    symptoms: 'Fièvre, courbatures, fatigue',
  },
  {
    id: 'h-6',
    title: 'Conjonctivite',
    specialist: 'Ophtalmologue',
    date: '24 Aout 2023',
    confidence: 90,
    alert: false,
    monthFilter: false,
    symptoms: 'Yeux rouges, démangeaisons',
  },
  {
    id: 'h-7',
    title: 'Otite moyenne',
    specialist: 'ORL',
    date: '10 Aout 2023',
    confidence: 85,
    alert: false,
    monthFilter: false,
    symptoms: "Mal d'oreille, fièvre",
  },
  {
    id: 'h-8',
    title: 'Crise hypertensive',
    specialist: 'Cardiologue',
    date: '28 Juil 2023',
    confidence: 91,
    alert: true,
    monthFilter: false,
    symptoms: 'Maux de tête sévères, palpitations',
  },
  {
    id: 'h-9',
    title: 'Gastrite',
    specialist: 'Gastro-entérologue',
    date: '14 Juil 2023',
    confidence: 76,
    alert: false,
    monthFilter: false,
    symptoms: "Brûlures d'estomac, nausées",
  },
  {
    id: 'h-10',
    title: 'Entorse poignet',
    specialist: 'Médecin du sport',
    date: '02 Juil 2023',
    confidence: 89,
    alert: false,
    monthFilter: false,
    symptoms: 'Douleur au poignet, gonflement',
  },
  {
    id: 'h-11',
    title: 'Angine blanche',
    specialist: 'Généraliste',
    date: '18 Juin 2023',
    confidence: 85,
    alert: false,
    monthFilter: false,
    symptoms: 'Mal de gorge, fièvre, amygdales gonflées',
  },
  {
    id: 'h-12',
    title: 'Allergie au pollen',
    specialist: 'Allergologue',
    date: '05 Juin 2023',
    confidence: 93,
    alert: false,
    monthFilter: false,
    symptoms: 'Éternuements, nez qui coule, yeux larmoyants',
  },
];

const MOCK_FOLLOWUP: FollowUpData[] = [
  {
    id: 'followup-1',
    title: 'Grippe saisonnière',
    status: 'pending',
    statusLabel: 'À faire',
    time: "Aujourd'hui, 18:00",
    day: 'J+2',
  },
  {
    id: 'followup-2',
    title: 'Migraine passagère',
    status: 'completed',
    statusLabel: 'Terminé',
    time: 'Hier, 10:00',
    day: 'J+1',
  },
];

// History functions
export function getLocalHistory(): HistoryRecord[] {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(MOCK_HISTORY));
    return MOCK_HISTORY;
  }
  return JSON.parse(data);
}

export function saveLocalHistory(records: HistoryRecord[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

export function addLocalHistoryRecord(newRec: Omit<HistoryRecord, 'id' | 'date' | 'monthFilter'>): HistoryRecord[] {
  const records = getLocalHistory();
  const dateObj = new Date();
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  
  const record: HistoryRecord = {
    ...newRec,
    id: `h-${Date.now()}`,
    date: formattedDate,
    monthFilter: true,
  };
  
  const updated = [record, ...records];
  saveLocalHistory(updated);
  return updated;
}

// Follow-up functions
export function getLocalFollowUps(): FollowUpData[] {
  const data = localStorage.getItem(FOLLOWUP_KEY);
  if (!data) {
    localStorage.setItem(FOLLOWUP_KEY, JSON.stringify(MOCK_FOLLOWUP));
    return MOCK_FOLLOWUP;
  }
  return JSON.parse(data);
}

export function saveLocalFollowUps(followups: FollowUpData[]): void {
  localStorage.setItem(FOLLOWUP_KEY, JSON.stringify(followups));
}

export function addLocalFollowUp(title: string, todoLabel: string): FollowUpData[] {
  const followups = getLocalFollowUps();
  const newFollow: FollowUpData = {
    id: `followup-${Date.now()}`,
    title,
    status: 'pending',
    statusLabel: todoLabel,
    time: "Aujourd'hui, 18:00",
    day: 'J+1',
  };
  const updated = [newFollow, ...followups];
  saveLocalFollowUps(updated);
  return updated;
}

export function completeLocalFollowUp(id: string, completedLabel: string): FollowUpData[] {
  const followups = getLocalFollowUps();
  const updated = followups.map((f) =>
    f.id === id ? { ...f, status: 'completed' as const, statusLabel: completedLabel } : f
  );
  saveLocalFollowUps(updated);
  return updated;
}
