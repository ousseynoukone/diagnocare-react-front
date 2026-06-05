import { apiClient } from '../AxiosApiClient';

export type GenderEnum = 'MALE' | 'FEMALE';

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

// Fetch medical profile by user ID
export function getProfileByUserId(userId: number): Promise<PatientMedicalProfileDTO> {
  return apiClient.get(`/patient-profiles/user/${userId}`)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Fetching medical profile failed:', error);
      throw error;
    });
}

// Create or update medical profile
export function createOrUpdateProfileRequest(request: PatientMedicalProfileRequest): Promise<PatientMedicalProfileDTO> {
  return apiClient.post('/patient-profiles', request)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Saving medical profile failed:', error);
      throw error;
    });
}
