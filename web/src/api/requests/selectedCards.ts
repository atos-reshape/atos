import { SelectedCards } from '../models/SelectedCards';

export const useLikeCard = (roundId: string) => {
  return async (cardId: string): Promise<SelectedCards> => {
    const res = await fetch(
      `/api/lobbies/rounds/${roundId}/select-cards/like/${cardId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
    return await res.json();
  };
};

export const useUnLikeCard = (roundId: string) => {
  return async (cardId: string): Promise<SelectedCards> => {
    const res = await fetch(
      `/api/lobbies/rounds/${roundId}/select-cards/unlike/${cardId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
    return await res.json();
  };
};

export const useFinishSelecting = (roundId: string) => {
  return async (): Promise<SelectedCards> => {
    const res = await fetch(
      `/api/lobbies/rounds/${roundId}/select-cards/finish`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
    return await res.json();
  };
};
