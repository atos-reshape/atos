import { useFetch } from '../react-query/hooks';

export interface Card {
  createdAt: string;
  deletedAt: string | null;
  id: string;
  tag: string | null;
  text: string;
  updatedAt: string;
}

export const useGetCards = (options: any = {}) => {
  return useFetch<any>('/api/cards', {}, options);
};

export const useGetCard = (id: string, options: any = {}) => {
  return useFetch<Card>(`/api/cards/${id}`, {}, options);
};
