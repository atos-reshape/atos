import Navbar from '../../components/NavbarGame/Navbar';
import { SocketProvider } from '../../hooks/useSocketContext';
import { PlayerGameProvider } from '../../hooks/usePlayerGameContext';
import PlayerGameView from '../../components/PlayerGameView/PlayerGameView';

function GameView() {
  return (
    <SocketProvider>
      <PlayerGameProvider>
        <Navbar />
        <PlayerGameView />
      </PlayerGameProvider>
    </SocketProvider>
  );
}

export default GameView;
