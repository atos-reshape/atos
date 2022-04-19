import { createContext, useContext, useEffect } from 'react';
import { SocketContext } from './SocketProvider';
import { Lobby } from '../../../../api/models/Lobby';
import { Player } from '../../../../api/models/Player';
import { useGameState } from './useGameState';
import { COLORS, usePlayerColors } from './usePlayerColors';

interface Props {
  children: JSX.Element;
}

type GameContext = {
  lobby: Lobby;
  players: Player[];
  addCard: (id: string) => void;
};

type ColorContext = {
  findColor: (id: string) => COLORS;
};

const GameContext = createContext<GameContext>({} as GameContext);
const ColorContext = createContext<ColorContext>({} as ColorContext);

const GameProvider = ({ children }: Props) => {
  const { state, updateRound, addPlayer, onLoad, addCard } = useGameState();
  const { findColor } = usePlayerColors();
  const { socket } = useContext(SocketContext);

  // Loading initial data from server state
  useEffect(() => {
    socket.emit('getLobby', null, (lobby: Lobby) => {
      socket.emit('getPlayers', null, (players: Player[]) => {
        onLoad(lobby, players);
      });
    });
  }, [socket]);

  // Subscribing to events from server
  useEffect(() => {
    socket.on('player.joined', addPlayer);
    socket.on('round.started', updateRound);
    socket.on('round.ended', updateRound);
    socket.on('round.created', updateRound);
    socket.on('round.updated', updateRound);
  }, [socket]);

  if (state.loading) {
    // TODO Create a nice loading screen...
    return <div>Loading Game Data</div>;
  }

  const { lobby, players } = state;
  return (
    <GameContext.Provider value={{ lobby, players, addCard }}>
      <ColorContext.Provider value={{ findColor }}>
        {children}
      </ColorContext.Provider>
    </GameContext.Provider>
  );
};

export { GameProvider, GameContext, ColorContext };
