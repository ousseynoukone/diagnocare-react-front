import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  getCheckInsByUserId,
  getDetailedCheckInsByUser,
  activateCheckInRequest,
  submitCheckInRequest,
} from '../api-s/requests/CheckInRequest';
import type { CheckInActivateRequest, CheckInCreateRequest } from '../api-s/requests/CheckInRequest';

export const useCheckIns = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['check-ins', userId],
    queryFn: () => getCheckInsByUserId(userId!),
    enabled: !!userId,
  });
};

export const useDetailedCheckIns = (userId: number | undefined) => {
  const { i18n } = useTranslation();
  const lang = i18n.language ? i18n.language.split('-')[0] : 'fr';
  return useQuery({
    queryKey: ['check-ins-detailed', userId, lang],
    queryFn: () => getDetailedCheckInsByUser(userId!, lang),
    enabled: !!userId,
  });
};

export const useActivateCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CheckInActivateRequest) => activateCheckInRequest(request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['check-ins', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['check-ins-detailed', variables.userId] });
    },
  });
};

export const useSubmitCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CheckInCreateRequest) => submitCheckInRequest(request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['check-ins', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['check-ins-detailed', variables.userId] });
    },
  });
};
