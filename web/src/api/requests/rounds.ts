import { useCreate, useUpdate } from '../react-query/hooks';
import { Round } from '../models/Round';

interface CreateRound {
  cards: string[];
}

export const useCreateRound = (id: string, lobbyId: string) => {
  return useCreate<Round, CreateRound>(`/api/lobbies/${lobbyId}/rounds/${id}`);
};

export const useUpdateCardsOfRound = (id: string) => {
  return useUpdate<Round, CreateRound>(`/api/lobbies/rounds/${id}/cards`);
};

export const useStartRound = (id: string) => {
  return useUpdate<Round>(`/api/lobbies/rounds/${id}/start`);
};

export const useEndRound = (id: string) => {
  return useUpdate<Round>(`/api/lobbies/rounds/${id}/end`);
};
