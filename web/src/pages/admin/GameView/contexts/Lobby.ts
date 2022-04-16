export interface Lobby {
  code: string;
  createdAt: string;
  updatedAt: string;
  currentRound: {
    cards: string[];
    createdAt: string;
    id: string;
    lobbyId: string;
    updatedAt: string;
  };
  id: string;
  title: string;
}
