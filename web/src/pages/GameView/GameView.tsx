import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/NavbarGame/Navbar';
import { SocketProvider } from '../../hooks/useSocketContext';
import { PlayerGameProvider } from '../../hooks/usePlayerGameContext';
import PlayerGameView from '../../components/PlayerGameView/PlayerGameView';

function GameView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  return (
    <SocketProvider id={id}>
      <PlayerGameProvider>
        <Navbar />
        <PlayerGameView />
      </PlayerGameProvider>
    </SocketProvider>
  );
}

export default GameView;
