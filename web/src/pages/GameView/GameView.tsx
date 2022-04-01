import { useSearchParams } from 'react-router-dom';
import CardSocket from '../../components/CardSocket/CardSocket';
import { SocketProvider } from '../../hooks/useSocketContext';

function GameView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  return (
    <SocketProvider id={id}>
      <CardSocket />
    </SocketProvider>
  );
}

export default GameView;
