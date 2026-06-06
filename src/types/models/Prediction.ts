import type { DiagnosisPossibility } from './Evaluation';

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
  id: string;
  title: string;
  specialist: string;
  specialistConfidence?: number;
  date: string;
  confidence: number;
  alert: boolean;
  monthFilter: boolean;
  symptoms: string;
  sessionSymptomId: number;
  rawPrediction: PredictionDTO;
  description: string;
  alternatives: { name: string; score: number }[];
  allPossibilities: DiagnosisPossibility[];
}