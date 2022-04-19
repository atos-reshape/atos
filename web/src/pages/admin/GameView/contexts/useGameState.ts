import { useState } from 'react';
import { Lobby } from '../../../../api/models/Lobby';
import { Player } from '../../../../api/models/Player';
import { Round } from '../../../../api/models/Round';

type State = {
  loading: true;
  lobby?: Lobby;
  players?: Player[];
};

type LoadedState = {
  loading: false;
  lobby: Lobby;
  players: Player[];
};

export function useGameState() {
  const [state, setState] = useState<State | LoadedState>({
    loading: true
  });

  const updateRound = (round: Round) =>
    setState(
      (state): LoadedState =>
        ({
          ...state,
          lobby: { ...state.lobby, currentRound: round }
        } as LoadedState)
    );

  const addPlayer = ({ player }: { player: Player }) =>
    setState((state) => ({
      ...state,
      players: [...(state.players || []), player]
    }));

  const onLoad = (lobby: Lobby, players: Player[]) =>
    setState({ loading: false, lobby, players });

  const addCard = (cardId: string) =>
    setState((state) => {
      return {
        ...state,
        lobby: {
          ...state.lobby,
          currentRound: {
            ...state.lobby?.currentRound,
            cards: [...(state.lobby?.currentRound.cards as string[]), cardId]
          }
        }
      } as unknown as LoadedState;
    });

  return { state, updateRound, addPlayer, onLoad, addCard };
}
