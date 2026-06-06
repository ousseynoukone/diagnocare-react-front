import type { GenderEnum } from "./enums/GenderEnum";

export interface PatientMedicalProfileRequest {
  userId: number;
  isSmoking?: boolean;
  age?: number;
  gender?: GenderEnum | null;
  weight?: number;
  meanBloodPressure?: number;
  meanCholesterol?: number;
  sedentary?: boolean;
  bmi?: number;
  alcohol?: boolean;
  familyAntecedents?: string[];
}

export interface PatientMedicalProfileDTO {
  id: number;
  userId: number;
  isSmoking: boolean;
  age: number;
  gender: GenderEnum | null;
  weight: number;
  meanBloodPressure: number;
  meanCholesterol: number;
  sedentary: boolean;
  bmi: number;
  alcohol: boolean;
  familyAntecedents: string[];
}



export interface MedicalProfile {
  age: string;
  sexe: string;
  poids: string;
  taille: string;
  tension: string;
  cholesterol: string;
  antecedents: string;
  tabac: 'oui' | 'non';
  alcool: 'reguliere' | 'occasionnelle' | 'jamais';
  activite: string;
}

export const PROFILE_STORAGE_KEY = 'diagnocare-medical-profile';

export const DEFAULT_PROFILE: MedicalProfile = {
  age: '',
  sexe: 'Homme',
  poids: '',
  taille: '',
  tension: '',
  cholesterol: '',
  antecedents: '',
  tabac: 'non',
  alcool: 'jamais',
  activite: 'Sédentaire (peu ou pas de sport)',
};