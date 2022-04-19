import {
  useQuery,
  UseQueryOptions,
  UseMutationOptions,
  useMutation
} from 'react-query';
import { defaultFetch, defaultCreate } from './requests';

export const useFetch = <TResponse = any>(
  path: string,
  queryParams?: Record<string, any>,
  options?: UseQueryOptions<TResponse, any>
) => {
  if (process.env.NODE_ENV === 'development')
    path = 'http://localhost:8000' + path;

  return useQuery<TResponse, any>(
    [path, queryParams],
    async ({ queryKey }: any) => {
      return defaultFetch<TResponse>(queryKey[0], queryKey[1]);
    },
    options
  );
};

export const useCreate = <TResponse = any>(
  path: string,
  options?: UseMutationOptions<TResponse, any, any>
) => {
  if (process.env.NODE_ENV === 'development')
    path = 'http://localhost:8000' + path;

  return useMutation<TResponse, any, any>([path], defaultCreate(path), options);
};

export {};
