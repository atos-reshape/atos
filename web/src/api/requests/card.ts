import { useFetch } from '../react-query/hooks';

export const useGetCards = (options: any = {}) => {
  return useFetch<any>('http://localhost:8000/api/cards', {}, options);
};
