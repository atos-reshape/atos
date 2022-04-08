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
  return useCreate<any>('http://localhost:8000/api/cards', {
    onSuccess: invalidateCards
  });
};
