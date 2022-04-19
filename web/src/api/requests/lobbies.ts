import { useCreate, useFetch } from '../react-query/hooks';

interface Lobby {
  id: string;
  code: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const useCreateLobby = () => {
  return useCreate<Lobby>(`/api/lobbies`);
};

export const useGetLobbies = () => {
  return useFetch<Lobby[]>('/api/lobbies');
};
