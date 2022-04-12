import { useCreate } from '../react-query/hooks';

export const useCreateLobby = () => {
  return useCreate<any>(`${process.env.GATEWAY_BASE_URL}/api/lobbies`);
};
