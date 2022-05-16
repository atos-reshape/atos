import { useEffect, useState, createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<{
  state: Lobby | undefined;
  socket: Socket;
}>(null as any);

interface Lobby {
  code: string;
  createdAt: string;
  updatedAt: string;
  currentRound: { id: string };
  id: string;
  title: string;
}

const SocketProvider = ({ children }: { children: JSX.Element }) => {
  const [state, setState] = useState<Lobby | undefined>(undefined);
  let socket: Socket = null as unknown as Socket;
  useEffect(() => {
    socket = io('', {
      transports: ['websocket'],
      path: '/lobby/',
      auth: { token: localStorage.getItem('accessToken') }
    });

    socket.on('connect', function () {
      console.log('Connected');

      // this can be the ID returned from the separate lobby join http request.
      socket.emit('getLobby', (response: Lobby) => setState(response));
    });

    socket.on('player.joined', function (data) {
      console.log(data);
    });
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, state }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
