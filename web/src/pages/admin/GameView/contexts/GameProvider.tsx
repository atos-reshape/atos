import { createContext, useContext, useEffect } from 'react';
import { SocketContext } from './SocketProvider';
import { Lobby, Player, SelectedCards } from '../../../../api/models';
import { useGameState } from './useGameState';
import { COLORS, usePlayerColors } from './usePlayerColors';
import { AtosLoadingScreen } from '../../../../components/AtosLoadingScreen/AtosLoadingScreen';

interface Props {
  children: JSX.Element;
}

type GameContext = {
  lobby: Lobby;
  players: Player[];
  addCard: (id: string) => void;
  playerCards: { [key: string]: SelectedCards };
};

type ColorContext = {
  findColor: (id: string) => COLORS;
};

const GameContext = createContext<GameContext>({} as GameContext);
const ColorContext = createContext<ColorContext>({} as ColorContext);

const GameProvider = ({ children }: Props) => {
  const gameState = useGameState();
  const { findColor } = usePlayerColors();
  const { socket } = useContext(SocketContext);

  // Loading initial data from server state
  useEffect(() => {
    socket.emit('getLobby', null, (lobby: Lobby) => {
      socket.emit('getPlayers', null, (players: Player[]) => {
        gameState.onLoad(lobby, players);
      });
    });
  }, [socket]);

  // Subscribing to events from server
  useEffect(() => {
    socket.on('player.joined', gameState.addPlayer);
    socket.on('round.started', gameState.updateRound);
    socket.on('round.ended', gameState.updateRound);
    socket.on('round.created', gameState.updateRound);
    socket.on('round.updated', gameState.updateRound);
    socket.on('cards.selected.updated', gameState.updateSPC);
  }, [socket]);

  if (gameState.state.loading) return <AtosLoadingScreen />;

  const {
    state: { lobby, players },
    playerCards,
    addCard
  } = gameState;
  return (
    <GameContext.Provider value={{ lobby, players, addCard, playerCards }}>
      <ColorContext.Provider value={{ findColor }}>
        {children}
      </ColorContext.Provider>
    </GameContext.Provider>
  );
};

export { GameProvider, GameContext, ColorContext };
