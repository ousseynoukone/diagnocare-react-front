import { apiClient } from '../AxiosApiClient';
import { translateDisease } from '../../utils/translationHelper';

export interface CheckInActivateRequest {
  predictionId: number;
  userId: number;
}

export interface CheckInCreateRequest {
  checkInId: number;
  userId: number;
  previousPredictionId: number;
  symptomLabels: string[];
}

export type CheckInStatus = 'PENDING' | 'SENT_24H' | 'SENT_48H' | 'COMPLETED';
export type CheckInOutcome = 'IMPROVING' | 'STABLE' | 'WORSENING';

export interface CheckInResponseDTO {
  id: number;
  userId: number;
  previousPredictionId: number;
  status: CheckInStatus;
  outcome: CheckInOutcome | null;
  worseReason: string | null;
  previousBestScore: number | null;
  newBestScore: number | null;
  bestScoreDelta: number | null;
  firstReminderAt: string | null;
  secondReminderAt: string | null;
  completedAt: string | null;
}

export interface FollowUpData {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'locked';
  statusLabel: string;
  time: string;
  day: string;
  lockedUntil?: string;
  rawCheckIn: CheckInResponseDTO;
}

export function getCheckInsByUserId(userId: number): Promise<CheckInResponseDTO[]> {
  return apiClient.get('/check-ins', { params: { userId } })
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Fetching check-ins failed:', error);
      throw error;
    });
}

function formatDateTime(dateStr: string): string {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}, ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  } catch {
    return dateStr;
  }
}

export async function getDetailedCheckInsByUser(userId: number, lang: string = 'fr'): Promise<FollowUpData[]> {
  const checkIns = await getCheckInsByUserId(userId);
  if (!checkIns || checkIns.length === 0) return [];

  // Fetch pathology title once per unique predictionId
  const predIdSet = new Set(checkIns.map((ci) => ci.previousPredictionId));
  const titleCache = new Map<number, string>();
  await Promise.all(
    [...predIdSet].map(async (predId) => {
      try {
        const resp = await apiClient.get(`/pathology-results/prediction/${predId}`);
        const results = resp.data.data ?? resp.data;
        const best = Array.isArray(results) && results.length > 0 ? results[0] : null;
        titleCache.set(
          predId,
          best
            ? translateDisease(best.localizedDiseaseName || best.pathologyName, lang)
            : (lang === 'fr' ? 'Suivi de symptômes' : 'Symptom Follow-up'),
        );
      } catch {
        titleCache.set(predId, lang === 'fr' ? 'Suivi de symptômes' : 'Symptom Follow-up');
      }
    }),
  );

  // Group by previousPredictionId then sort by firstReminderAt to assign J+1 / J+2 labels
  const grouped = new Map<number, CheckInResponseDTO[]>();
  for (const ci of checkIns) {
    const list = grouped.get(ci.previousPredictionId) ?? [];
    list.push(ci);
    grouped.set(ci.previousPredictionId, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => (a.firstReminderAt ?? '').localeCompare(b.firstReminderAt ?? ''));
  }

  const now = new Date();

  const hydrated: FollowUpData[] = [];
  for (const [predId, cis] of grouped) {
    const title = titleCache.get(predId) ?? (lang === 'fr' ? 'Suivi de symptômes' : 'Symptom Follow-up');
    cis.forEach((ci, index) => {
      const roundLabel = `J+${index + 1}`;
      const isCompleted = ci.status === 'COMPLETED';
      const isLocked = !isCompleted && ci.firstReminderAt != null && new Date(ci.firstReminderAt) > now;

      const status: FollowUpData['status'] = isCompleted ? 'completed' : isLocked ? 'locked' : 'pending';

      const statusLabel = isCompleted
        ? (lang === 'fr' ? 'Terminé' : 'Completed')
        : isLocked
          ? (lang === 'fr' ? 'Pas encore disponible' : 'Not yet available')
          : (lang === 'fr' ? 'À faire' : 'To do');

      const time = isCompleted && ci.completedAt
        ? formatDateTime(ci.completedAt)
        : ci.firstReminderAt
          ? formatDateTime(ci.firstReminderAt)
          : (lang === 'fr' ? "Bientôt" : 'Soon');

      hydrated.push({
        id: String(ci.id),
        title,
        status,
        statusLabel,
        time,
        day: roundLabel,
        lockedUntil: isLocked && ci.firstReminderAt ? formatDateTime(ci.firstReminderAt) : undefined,
        rawCheckIn: ci,
      });
    });
  }

  // Sort: pending first, then locked, then completed; within same status by id
  return hydrated.sort((a, b) => {
    const order = { pending: 0, locked: 1, completed: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return Number(a.id) - Number(b.id);
  });
}

export function activateCheckInRequest(request: CheckInActivateRequest): Promise<CheckInResponseDTO> {
  return apiClient.post('/check-ins/activate', request)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Activating check-in failed:', error);
      throw error;
    });
}

export function submitCheckInRequest(request: CheckInCreateRequest): Promise<CheckInResponseDTO> {
  return apiClient.post('/check-ins', request)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Submitting check-in failed:', error);
      throw error;
    });
}
