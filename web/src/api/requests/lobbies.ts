import { useCreate } from '../react-query/hooks';

export const useCreateLobby = () => {
  return useCreate<any>('http://localhost:3001/lobbies');
};
