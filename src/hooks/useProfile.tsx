import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProfileByUserId, 
  createOrUpdateProfileRequest
} from '../api-s/requests/ProfileRequest';
import type { PatientMedicalProfileRequest } from '../api-s/requests/ProfileRequest';

export const useProfile = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfileByUserId(userId!),
    enabled: !!userId,
  });
};

export const useSaveProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: PatientMedicalProfileRequest) => createOrUpdateProfileRequest(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
    },
  });
};
