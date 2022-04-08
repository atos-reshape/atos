import { useCreate } from '../react-query/hooks';

export const useJoinGame = (code: string) => {
  return useCreate<any>(`http://localhost:8000/api/auth/join/${code}`);
};
