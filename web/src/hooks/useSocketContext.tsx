import { useEffect, useState, createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<any>(null);
export { SocketContext };

interface Lobby {
  code: string;
  createdAt: string;
  updatedAt: string;
  currentRound: object;
  id: string;
  title: string;
}

export const SocketProvider = ({ children, id }: any) => {
  const [state, setState] = useState<Lobby | undefined>(undefined);
  let socket: Socket = null as unknown as Socket;
  useEffect(() => {
    socket = io('http://localhost:3001', {
      transports: ['websocket'],
      path: '/lobby/'
    });

    socket.on('connect', function () {
      console.log('Connected');

      // this can be the ID returned from the separate lobby join http request.
      socket.emit('joinLobby', id, (response: Lobby) => {
        setState(response);
      });
    });
  }, []);

  return (
    <SocketContext.Provider value={{ socket, state }}>
      {children}
    </SocketContext.Provider>
  );
};
