import { SocketProvider } from './contexts/SocketProvider';
import { useSearchParams } from 'react-router-dom';
import { GameProvider } from './contexts/GameProvider';

export function GameView(): JSX.Element {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  return (
    <SocketProvider id={id as string}>
      <GameProvider>
        <div>test</div>
      </GameProvider>
    </SocketProvider>
  );
}
