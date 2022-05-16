import { io, Socket } from 'socket.io-client';
import { createContext, useEffect, useState } from 'react';
import { Lobby, Player, Round } from '../../../api/models';
import { AtosLoadingScreen } from '../../../components/AtosLoadingScreen/AtosLoadingScreen';

interface Props {
  children: JSX.Element;
  id: string;
}

type DefaultState = {
  connected: false;
  socket: null;
};

type ConnectedState = {
  connected: true;
  socket: Socket<ListenEvents, EmitEvents>;
};

type ErrorState = DefaultState & {
  message: string;
  error: true;
};

type State = DefaultState | ConnectedState | ErrorState;

interface SocketContext {
  socket: Socket<ListenEvents, EmitEvents>;
}

// These are manually typed receiver events for type safety.
type ListenEvents = {
  'player.joined': (data: { player: Player }) => void;
  'round.created': (round: Round) => void;
  'round.started': (round: Round) => void;
  'round.ended': (round: Round) => void;
  'round.updated': (round: Round) => void;
};

// These are manually typed send events for type safety.
type EmitEvents = {
  getLobby: (data: null, callback: (data: Lobby) => void) => void;
  getPlayers: (data: null, callback: (data: Player[]) => void) => void;
  joinLobby: (id: string, callback: (data: Lobby) => void) => void;
};

const SocketContext = createContext<SocketContext>({} as SocketContext);

const SocketProvider = ({ children, id }: Props) => {
  const [state, setState] = useState<State>({
    connected: false,
    socket: null
  });

  useEffect(() => {
    const socket = io('', {
      transports: ['websocket'],
      path: '/lobby/',
      auth: { token: localStorage.getItem('accessToken') }
    });

    socket.on('connect', () => {
      console.log('Connected');
      setState((state) => ({ ...state, connected: true, socket }));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
      setState((state) => ({
        ...state,
        connected: false,
        socket: null
      }));
    });

    socket.on('connect_error', (err) => {
      console.log('Connection failed:', err.message);
      setState((state) => ({
        ...state,
        connected: false,
        socket: null,
        error: true,
        message: err.message
      }));
    });
  }, []);

  if (!state.connected) return <AtosLoadingScreen />;

  return (
    <SocketContext.Provider value={{ socket: state.socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
