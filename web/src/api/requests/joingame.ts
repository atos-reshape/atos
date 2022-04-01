import { useCreate } from '../react-query/hooks';

export const useJoinGame = (code: string) => {
  return useCreate<any>(`http://localhost:3001/auth/join/${code}`);
};
