import { useCreate } from '../react-query/hooks';

export const useJoinGame = (code: string) => {
  return useCreate<any>(`/api/auth/join/${code}`);
};
