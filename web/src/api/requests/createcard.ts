import { useCreate } from '../react-query/hooks';

export const useCreateCard = () => {
  return useCreate<any>('http://localhost:3002/api/cards');
};
