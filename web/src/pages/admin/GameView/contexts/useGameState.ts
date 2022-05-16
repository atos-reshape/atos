import { useState } from 'react';
import { Round, Player, Lobby, SelectedCards } from '../../../../api/models';

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
  const [playerCards, setPlayerCards] = useState<{
    [key: string]: SelectedCards;
  }>({});

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

  const updateSPC = (selectedCards: SelectedCards) => {
    setPlayerCards((playerCards) => ({
      ...playerCards,
      [selectedCards.playerId]: selectedCards
    }));
  };

  return {
    state,
    updateRound,
    addPlayer,
    onLoad,
    addCard,
    updateSPC,
    playerCards
  };
}
