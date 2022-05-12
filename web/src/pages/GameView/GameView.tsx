import Navbar from '../../components/NavbarGame/Navbar';
import { Container, Grid } from '@mantine/core';
import { SocketProvider } from '../../hooks/useSocketContext';
import { PlayerGameProvider } from '../../hooks/usePlayerGameContext';
import PlayerGameView from '../../components/PlayerGameView/PlayerGameView';
import { PlayerList } from '../admin/GameView/PlayerList';
import { useContext } from 'react';
import { GameContext } from './contexts/GameProvider';
import { ActiveGame } from '../admin/GameView/ActiveGame';
import { GameSettings } from '../admin/GameView/GameSettings';

function GameView() {
  const { lobby } = useContext(GameContext);

  if (!lobby.currentRound.startedAt)
    return (
      <Container size={1000}>
        <Grid justify="center" style={{ height: 600 }} gutter="xl">
          <Grid.Col span={10}>
            <GameSettings />
          </Grid.Col>
        </Grid>
      </Container>
    );
  // return (
  //   <SocketProvider>
  //     <PlayerGameProvider>
  //       <Navbar />
  //       <PlayerGameView />
  //     </PlayerGameProvider>
  //   </SocketProvider>
  // );

  if (!!lobby.currentRound.startedAt && !lobby.currentRound.endedAt)
    return <ActiveGame />;

  if (!!lobby.currentRound.startedAt && !!lobby.currentRound.endedAt)
    return <div>Has already started, and also ended</div>;

  return <div>Undefined</div>;
}

export default GameView;
