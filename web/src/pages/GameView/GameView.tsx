import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from '../../components/NavbarGame/Navbar';
import { SocketProvider } from '../../hooks/useSocketContext';
import { PlayerGameProvider } from '../../hooks/usePlayerGameContext';
import { GameContext } from './contexts/GameProvider';
import PlayerGameView from '../../components/PlayerGameView/PlayerGameView';
import { Container, Grid } from '@mantine/core';
import { PlayerList } from './PlayerList';

function GameView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { lobby } = useContext(GameContext);
  // console.log(lobby);
  // if (!lobby.currentRound.startedAt) {
  //   console.log('hey');
    return (
      <SocketProvider>
        <Container size={1000}>
          <PlayerGameProvider>
            <Grid justify="center" style={{ height: 600 }} gutter="xl">
              <Grid.Col span={9}>
                <PlayerList />
              </Grid.Col>
            </Grid>
          </PlayerGameProvider>
        </Container>
      </SocketProvider>
    );
  // }
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
