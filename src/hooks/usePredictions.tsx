import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPredictionsByUserId, 
  getDetailedPredictionsByUser,
  createPredictionRequest,
  deletePrediction,
  deleteAllPredictions
} from '../api-s/requests/PredictionRequest';
import type { CreatePredictionRequest } from '../types/models/Prediction';

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

export const useDeletePrediction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePrediction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['predictions-detailed'] });
    },
  });
};

export const useDeleteAllPredictions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deleteAllPredictions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['predictions-detailed'] });
    },
  });
};

