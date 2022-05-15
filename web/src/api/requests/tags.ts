import { useFetch } from '../react-query/hooks';

export interface Tag {
  createdAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  updatedAt: string;
  description: string;
}

export const useGetTags = (options: any = {}) => {
  return useFetch<Array<Tag>>('/api/tags', {}, options);
};
