import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getPredictionsByUserId, 
  getDetailedPredictionsByUser,
  createPredictionRequest
} from '../api-s/requests/PredictionRequest';
import type { CreatePredictionRequest } from '../api-s/requests/PredictionRequest';

export const usePredictions = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['predictions', userId],
    queryFn: () => getPredictionsByUserId(userId!),
    enabled: !!userId,
  });
};

export const useDetailedPredictions = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['predictions-detailed', userId],
    queryFn: () => getDetailedPredictionsByUser(userId!),
    enabled: !!userId,
  });
};

export const useCreatePrediction = () => {
  return useMutation({
    mutationFn: (request: CreatePredictionRequest) => createPredictionRequest(request),
  });
};
