import { useCreate } from '../react-query/hooks';

export const useCreateLobby = () => {
  return useCreate<any>('http://localhost:8000/api/lobbies');
};
