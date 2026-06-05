import { apiClient } from '../AxiosApiClient';

export interface CheckInCreateRequest {
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
  status: 'pending' | 'completed';
  statusLabel: string;
  time: string;
  day: string;
  rawCheckIn: CheckInResponseDTO;
}

// Fetch all check-ins for a specific user
export function getCheckInsByUserId(userId: number): Promise<CheckInResponseDTO[]> {
  return apiClient.get('/check-ins', { params: { userId } })
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Fetching check-ins failed:', error);
      throw error;
    });
}

// Helper to format dates to French style (e.g. "12 Oct 2023, 18:00")
function formatDateTime(dateStr: string): string {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}, ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  } catch (e) {
    return dateStr;
  }
}

// Fetch and hydrate all check-ins for a specific user to match local FollowUpData shape
export async function getDetailedCheckInsByUser(userId: number): Promise<FollowUpData[]> {
  const checkIns = await getCheckInsByUserId(userId);
  if (!checkIns || checkIns.length === 0) return [];

  const hydrated = await Promise.all(
    checkIns.map(async (ci) => {
      try {
        // Fetch the pathology results of the previous prediction to get its title
        const pathResponse = await apiClient.get(`/pathology-results/prediction/${ci.previousPredictionId}`);
        const pathologyResults = pathResponse.data.data ?? pathResponse.data;
        const bestPathology = Array.isArray(pathologyResults) && pathologyResults.length > 0
          ? pathologyResults[0]
          : null;

        const title = bestPathology ? bestPathology.pathologyName : 'Suivi de symptômes';
        const isCompleted = ci.status === 'COMPLETED';

        return {
          id: String(ci.id),
          title,
          status: isCompleted ? ('completed' as const) : ('pending' as const),
          statusLabel: isCompleted ? 'Terminé' : 'À faire',
          time: ci.completedAt 
            ? formatDateTime(ci.completedAt) 
            : (ci.firstReminderAt ? formatDateTime(ci.firstReminderAt) : "Aujourd'hui, 18:00"),
          day: 'J+1',
          rawCheckIn: ci,
        };
      } catch (err) {
        console.error(`Failed to hydrate check-in ${ci.id}:`, err);
        const isCompleted = ci.status === 'COMPLETED';
        return {
          id: String(ci.id),
          title: 'Suivi de symptômes',
          status: isCompleted ? ('completed' as const) : ('pending' as const),
          statusLabel: isCompleted ? 'Terminé' : 'À faire',
          time: "Aujourd'hui, 18:00",
          day: 'J+1',
          rawCheckIn: ci,
        };
      }
    })
  );

  // Sort: pending first, then by id descending
  return hydrated.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }
    return Number(b.id) - Number(a.id);
  });
}

// Submit a new symptom check-in
export function submitCheckInRequest(request: CheckInCreateRequest): Promise<CheckInResponseDTO> {
  return apiClient.post('/check-ins', request)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Submitting check-in failed:', error);
      throw error;
    });
}
