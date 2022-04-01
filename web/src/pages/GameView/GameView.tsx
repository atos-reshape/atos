import { useEffect, createContext, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SocketProvider } from '../hooks/useSocketContext';

function GameView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = '7475eba3-5558-48ec-9881-cecdc0125066';

  return (
    <SocketProvider id={id}>
      <h1>Game</h1>
    </SocketProvider>
  );
}

export default GameView;
