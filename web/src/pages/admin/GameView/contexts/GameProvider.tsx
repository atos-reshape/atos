import { createContext, useContext, useEffect, useState } from 'react';
import { SocketContext } from './SocketProvider';
import { Lobby } from './Lobby';
import { Player } from './Player';

interface Props {
  children: JSX.Element;
}

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

type GameContext = {
  lobby: Lobby;
  players: Player[];
};

const GameContext = createContext<GameContext>({} as GameContext);

const GameProvider = ({ children }: Props) => {
  const [state, setState] = useState<State | LoadedState>({
    loading: true
  });
  const { socket } = useContext(SocketContext);

  // Loading initial data from server state
  useEffect(() => {
    socket.emit('getLobby', null, (lobby: Lobby) => {
      socket.emit('getPlayers', null, (players: Player[]) => {
        setState({ loading: false, lobby, players });
      });
    });
  }, [socket]);

  // Subscribing to events from server
  useEffect(() => {
    socket.on('player.joined', ({ player }) =>
      setState((state) => ({
        ...state,
        players: [...(state.players || []), player]
      }))
    );
  }, [socket]);

  if (state.loading) {
    return <div>Loading Game Data</div>;
  }

  return (
    <GameContext.Provider
      value={{
        lobby: state.lobby,
        players: state.players
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameProvider, GameContext };
