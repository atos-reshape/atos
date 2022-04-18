import { Container, Grid } from '@mantine/core';
import { PlayerList } from './PlayerList';
import { useContext } from 'react';
import { GameContext } from './contexts/GameProvider';
import { GameSettings } from './GameSettings';
import { ActiveGame } from './ActiveGame';

export function GameView(): JSX.Element {
  const { lobby } = useContext(GameContext);

  if (!lobby.currentRound.startedAt)
    return (
      <Container size={1000}>
        <Grid justify="center" style={{ height: 600 }} gutter="xl">
          <Grid.Col span={8}>
            <GameSettings />
          </Grid.Col>
          <Grid.Col span={4}>
            <PlayerList />
          </Grid.Col>
        </Grid>
      </Container>
    );

  if (!!lobby.currentRound.startedAt && !lobby.currentRound.endedAt)
    return <ActiveGame />;

  if (!!lobby.currentRound.startedAt && !!lobby.currentRound.endedAt)
    return <div>Has already started, and also ended</div>;

  return <div>Undefined</div>;
}
