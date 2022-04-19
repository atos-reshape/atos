import { Round } from './Round';

export interface Lobby {
  code: string;
  createdAt: string;
  updatedAt: string;
  currentRound: Round;
  id: string;
  title: string;
}
