import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getCheckInsByUserId, 
  getDetailedCheckInsByUser,
  submitCheckInRequest
} from '../api-s/requests/CheckInRequest';
import type { CheckInCreateRequest } from '../api-s/requests/CheckInRequest';

export const useCheckIns = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['check-ins', userId],
    queryFn: () => getCheckInsByUserId(userId!),
    enabled: !!userId,
  });
};

export const useDetailedCheckIns = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['check-ins-detailed', userId],
    queryFn: () => getDetailedCheckInsByUser(userId!),
    enabled: !!userId,
  });
};

export const useSubmitCheckIn = () => {
  return useMutation({
    mutationFn: (request: CheckInCreateRequest) => submitCheckInRequest(request),
  });
};
