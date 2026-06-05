import { useQuery } from '@tanstack/react-query';
import { getMLSymptomsMetadata } from '../api-s/requests/SymptomRequest';

export const useMLSymptomsMetadata = () => {
  return useQuery({
    queryKey: ['symptoms-ml-metadata'],
    queryFn: getMLSymptomsMetadata,
    staleTime: Infinity, // Symptoms metadata doesn't change frequently; cache indefinitely
  });
};
