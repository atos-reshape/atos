import { useFetch } from '../react-query/hooks';

export const useGetCards = () => {
  return useFetch<any>('http://localhost:3002/api/cards');
};
