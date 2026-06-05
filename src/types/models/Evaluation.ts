export interface Symptom {
  id: string;
  label: string;
  en: string;
}

export interface Doctor {
  name: string;
  specialist: string;
  sector: string;
  rating: number;
  reviews: number;
  address: string;
  nextSlot: string;
  coords: { x: number; y: number };
  phone: string;
}

export interface DiagnosisPossibility {
  title: string;
  description: string;
  confidence: number;
  specialist: string;
  specialistConfidence?: number;
  isPrimary: boolean;
}

export interface PredictionResult {
  id?: number;
  title: string;
  description: string;
  confidence: number;
  specialist: string;
  specialistConfidence?: number;
  urgent?: boolean;
  alternatives: { name: string; score: number }[];
  doctors: Doctor[];
  profileUsed?: Record<string, string>;
  symptoms?: string[];
  allPossibilities?: DiagnosisPossibility[];
}
