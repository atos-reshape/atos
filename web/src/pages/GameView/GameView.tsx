import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/NavbarGame/Navbar';
import { SocketProvider } from '../../hooks/useSocketContext';
import { PlayerGameProvider } from '../../hooks/usePlayerGameContext';
import './GameView.css';
import PlayerGameView1 from '../../components/PlayerGameView1/PlayerGameView1';
import PlayerGameView2 from '../../components/PlayerGameView2/PlayerGameView2';

function GameView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  return (
    <SocketProvider id={id}>
      <PlayerGameProvider>
        <Navbar />
        {/* <PlayerGameView1 /> */}
        <PlayerGameView2 />
      </PlayerGameProvider>
    </SocketProvider>
  );
}

export default GameView;
