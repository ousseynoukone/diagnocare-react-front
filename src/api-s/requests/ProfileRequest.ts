import type { PatientMedicalProfileDTO, PatientMedicalProfileRequest } from '../../types/models/MedicalProfil';
import { apiClient } from '../AxiosApiClient';



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
