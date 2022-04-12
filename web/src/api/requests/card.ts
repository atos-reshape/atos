import { useFetch } from '../react-query/hooks';

export const useGetCards = (options: any = {}) => {
  return useFetch<any>(
    `${process.env.GATEWAY_BASE_URL}/api/cards`,
    {},
    options
  );
};
