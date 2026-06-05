import { apiClient } from '../AxiosApiClient';

export interface CreatePredictionRequest {
  userId: number;
  symptomLabels: string[];
}

export interface PredictionDTO {
  id: number;
  bestScore: number;
  pdfReportUrl: string | null;
  isRedAlert: boolean;
  comment: string | null;
  sessionSymptomId: number;
  previousPredictionId: number | null;
  createdAt: string;
}

export interface PredictionWithResultsResponse {
  prediction: PredictionDTO;
  mlResults: any;
}

export interface HydratedPrediction {
  id: string; // String ID to match local mock expectations
  title: string;
  specialist: string;
  date: string;
  confidence: number;
  alert: boolean;
  monthFilter: boolean;
  symptoms: string;
  sessionSymptomId: number;
  rawPrediction: PredictionDTO;
}

// Fetch all predictions for a specific user
export function getPredictionsByUserId(userId: number): Promise<PredictionDTO[]> {
  return apiClient.get(`/predictions/user/${userId}`)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Fetching predictions failed:', error);
      throw error;
    });
}

// Helper to format dates to French style (e.g. "12 Oct 2023")
function formatDate(dateStr: string): string {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  } catch (e) {
    return dateStr;
  }
}

// Helper to check if a date is within the current month
function isCurrentMonth(dateStr: string): boolean {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return false;
    const now = new Date();
    return dateObj.getMonth() === now.getMonth() && dateObj.getFullYear() === now.getFullYear();
  } catch (e) {
    return false;
  }
}

// Fetch and hydrate all predictions for a specific user to match local HistoryRecord shape
export async function getDetailedPredictionsByUser(userId: number): Promise<HydratedPrediction[]> {
  const predictions = await getPredictionsByUserId(userId);
  if (!predictions || predictions.length === 0) return [];

  const hydrated = await Promise.all(
    predictions.map(async (pred) => {
      try {
        // Fetch pathology results for this prediction
        const pathResponse = await apiClient.get(`/pathology-results/prediction/${pred.id}`);
        const pathologyResults = pathResponse.data.data ?? pathResponse.data;

        // Fetch session symptoms
        const sessionResponse = await apiClient.get(`/session-symptoms/${pred.sessionSymptomId}`);
        const sessionSymptom = sessionResponse.data.data ?? sessionResponse.data;

        const bestPathology = Array.isArray(pathologyResults) && pathologyResults.length > 0
          ? pathologyResults[0]
          : null;

        const symptomsList = sessionSymptom && Array.isArray(sessionSymptom.symptoms)
          ? sessionSymptom.symptoms.map((s: any) => s.label).join(', ')
          : '';

        // Scale bestScore from decimal (e.g. 0.88) to percentage (88)
        let scorePct = pred.bestScore;
        if (scorePct <= 1.0) {
          scorePct = scorePct * 100;
        }
        scorePct = Math.round(scorePct);

        return {
          id: String(pred.id),
          title: bestPathology ? bestPathology.pathologyName : (pred.comment || 'Analyse de symptômes'),
          specialist: bestPathology ? bestPathology.doctorSpecialistLabel : 'Généraliste',
          date: formatDate(pred.createdAt),
          confidence: scorePct,
          alert: pred.isRedAlert,
          monthFilter: isCurrentMonth(pred.createdAt),
          symptoms: symptomsList,
          sessionSymptomId: pred.sessionSymptomId,
          rawPrediction: pred,
        };
      } catch (err) {
        console.error(`Failed to hydrate prediction ${pred.id}:`, err);
        // Safe fallback in case of errors
        let scorePct = pred.bestScore;
        if (scorePct <= 1.0) {
          scorePct = scorePct * 100;
        }
        scorePct = Math.round(scorePct);

        return {
          id: String(pred.id),
          title: pred.comment || 'Analyse de symptômes',
          specialist: 'Généraliste',
          date: formatDate(pred.createdAt),
          confidence: scorePct,
          alert: pred.isRedAlert,
          monthFilter: isCurrentMonth(pred.createdAt),
          symptoms: '',
          sessionSymptomId: pred.sessionSymptomId,
          rawPrediction: pred,
        };
      }
    })
  );

  // Sort by date/id descending so most recent is first
  return hydrated.sort((a, b) => Number(b.id) - Number(a.id));
}

// Create a new symptoms prediction
export function createPredictionRequest(request: CreatePredictionRequest): Promise<PredictionWithResultsResponse> {
  return apiClient.post('/predictions', request)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Creating prediction failed:', error);
      throw error;
    });
}
