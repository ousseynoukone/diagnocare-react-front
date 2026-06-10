import type { CreatePredictionRequest, HydratedPrediction, PredictionDTO, PredictionWithResultsResponse } from '../../types/models/Prediction';
import { apiClient } from '../AxiosApiClient';
import { translateDisease, translateSpecialist } from '../../utils/translationHelper';



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
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}, ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
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
export async function getDetailedPredictionsByUser(userId: number, lang: string = 'fr'): Promise<HydratedPrediction[]> {
  const predictions = await getPredictionsByUserId(userId);
  if (!predictions || predictions.length === 0) return [];

  // Build a symptom translation map once for all predictions: { [english_id]: translated_label }
  let symptomTranslationMap: Record<string, string> = {};
  try {
    const metaResponse = await apiClient.get('/symptoms/ml-metadata');
    const meta = metaResponse.data.data ?? metaResponse.data;
    const langArray: Array<{ id: string; label: string }> = meta?.symptoms?.[lang] ?? meta?.symptoms?.fr ?? [];
    symptomTranslationMap = Object.fromEntries(langArray.map((s) => [s.id, s.label]));
  } catch {
    // Non-blocking: fall back to raw labels if metadata fetch fails
  }

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
          ? sessionSymptom.symptoms
              .map((s: any) => symptomTranslationMap[s.label] ?? s.label)
              .join(', ')
          : '';

        // Scale bestScore from decimal (e.g. 0.88) to percentage (88)
        const scorePct = Math.round(pred.bestScore);

        const alternativesList = Array.isArray(pathologyResults) && pathologyResults.length > 1
          ? pathologyResults.slice(1).map((alt: any) => {
              const score = alt.diseaseScore;
              const rawName = alt.localizedDiseaseName || alt.pathologyName;
              return {
                name: translateDisease(rawName, lang),
                score: Math.round(score)
              };
            })
          : [];

        const allPossibilitiesList = Array.isArray(pathologyResults)
          ? pathologyResults.map((alt: any, index: number) => {
              const score = alt.diseaseScore;
              const rawTitle = alt.localizedDiseaseName || alt.pathologyName;
              const rawSpecialist = alt.localizedSpecialistLabel || alt.doctorSpecialistLabel || 'Généraliste';
              return {
                title: translateDisease(rawTitle, lang),
                description: alt.description || '',
                confidence: Math.round(score),
                specialist: translateSpecialist(rawSpecialist, lang),
                specialistConfidence: alt.specialistScore !== undefined ? Math.round(alt.specialistScore) : 0,
                isPrimary: index === 0
              };
            })
          : [];

        const rawTitle = bestPathology ? (bestPathology.localizedDiseaseName || bestPathology.pathologyName) : (pred.comment || 'Analyse de symptômes');
        const rawSpecialist = bestPathology ? (bestPathology.localizedSpecialistLabel || bestPathology.doctorSpecialistLabel) : 'Généraliste';

        return {
          id: String(pred.id),
          title: translateDisease(rawTitle, lang),
          specialist: translateSpecialist(rawSpecialist, lang),
          specialistConfidence: bestPathology && bestPathology.specialistScore !== undefined ? Math.round(bestPathology.specialistScore) : 0,
          date: formatDate(pred.createdAt),
          confidence: scorePct,
          alert: pred.isRedAlert,
          monthFilter: isCurrentMonth(pred.createdAt),
          symptoms: symptomsList,
          sessionSymptomId: pred.sessionSymptomId,
          rawPrediction: pred,
          description: bestPathology ? bestPathology.description : '',
          alternatives: alternativesList,
          allPossibilities: allPossibilitiesList
        };
      } catch (err) {
        console.error(`Failed to hydrate prediction ${pred.id}:`, err);
        // Safe fallback in case of errors
        const scorePct = Math.round(pred.bestScore);

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
          description: '',
          alternatives: [],
          allPossibilities: []
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

// Delete a single prediction
export function deletePrediction(id: number): Promise<void> {
  return apiClient.delete(`/predictions/${id}`)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error(`Deleting prediction ${id} failed:`, error);
      throw error;
    });
}

// Delete all predictions of a user
export function deleteAllPredictions(userId: number): Promise<void> {
  return apiClient.delete(`/predictions/user/${userId}`)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error(`Deleting all predictions for user ${userId} failed:`, error);
      throw error;
    });
}

