import { useQueryClient } from 'react-query';
import { useCreate } from '../react-query/hooks';

const useInvalidateCards = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries('/api/cards');
  };
};

export const useCreateCard = () => {
  const invalidateCards = useInvalidateCards();
  return useCreate<any>(`${process.env.GATEWAY_BASE_URL}/api/cards`, {
    onSuccess: invalidateCards
  });
};
