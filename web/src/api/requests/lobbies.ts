import { useCreate } from '../react-query/hooks';

export const useCreateLobby = () => {
  return useCreate<any>(`/api/lobbies`);
};
