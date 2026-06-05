import { useMutation } from '@tanstack/react-query';
import { createReport, type CreateReportRequest } from '../api-s/requests/ReportRequest';

export const useCreateReport = () => {
  return useMutation({
    mutationFn: (request: CreateReportRequest) => createReport(request),
  });
};
