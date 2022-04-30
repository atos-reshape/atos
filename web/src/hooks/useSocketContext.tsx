import { useEffect, useState, createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<any>(null);

interface Lobby {
  code: string;
  createdAt: string;
  updatedAt: string;
  currentRound: object;
  id: string;
  title: string;
}

const SocketProvider = ({ children }: { children: JSX.Element }) => {
  const [state, setState] = useState<Lobby | undefined>(undefined);
  let socket: Socket = null as unknown as Socket;
  useEffect(() => {
    socket = io('http://localhost:8000', {
      transports: ['websocket'],
      path: '/lobby/',
      auth: { token: localStorage.getItem('accessTokenAtos') }
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
