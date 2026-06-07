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

// History functions
export function getLocalHistory(): HistoryRecord[] {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return [];
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
  if (!data) return [];
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
