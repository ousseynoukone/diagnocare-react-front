import { apiClient } from '../AxiosApiClient';
import type { MLFeaturesMetadataResponse } from '../../types/models/Symptom';

export function getMLSymptomsMetadata(): Promise<MLFeaturesMetadataResponse> {
  return apiClient.get('/symptoms/ml-metadata')
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Fetching ML symptoms metadata failed:', error);
      throw error;
    });
}
