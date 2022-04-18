import { useFetch } from '../react-query/hooks';

export const useGetCards = (options: any = {}) => {
  return useFetch<any>('/api/cards', {}, options);
};
