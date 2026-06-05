import { apiClient } from '../AxiosApiClient';

export interface CreateReportRequest {
  userId: number;
  title: string;
  comment: string;
  predictionId: number;
}

export interface ReportDTO {
  id: number;
  userId: number;
  title: string;
  comment: string;
  predictionId: number;
  reportDate: string;
  isCorrected: boolean;
}

// Create a new report/feedback for a prediction
export function createReport(request: CreateReportRequest): Promise<ReportDTO> {
  return apiClient.post('/reports', request)
    .then((response) => response.data.data ?? response.data)
    .catch((error) => {
      console.error('Creating report failed:', error);
      throw error;
    });
}
