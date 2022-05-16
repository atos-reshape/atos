import { Container, Grid, Group } from '@mantine/core';
import { Button, Tabs, Text } from '@mantine/core';
import { PlayerList } from './PlayerList';
import { useContext } from 'react';
import { GameContext } from './contexts/GameProvider';
import { GameSettings } from './../admin/GameView/GameSettings';
import { ActiveGame } from './../admin/GameView/ActiveGame';
import Navbar from '../../components/NavbarGame/Navbar';
import { SocketProvider } from '../../hooks/useSocketContext';
import { PlayerGameProvider } from '../../hooks/usePlayerGameContext';
import PlayerGameView from '../../components/PlayerGameView/PlayerGameView';
import styles from './styles.module.css';

export function GameView(): JSX.Element {
  const { lobby } = useContext(GameContext);

  if (!lobby.currentRound.startedAt) {
    return (
      <div className={styles.container}>
        <Container size={1000} style={{ backgroundColor: 'rgb(29, 28, 28)' }}>
          <Group grow>
            <Text>Lobby Code: {lobby.code}</Text>
            <Text>Lobby Title: {lobby.title}</Text>
            <Text>Waiting for admin to start the game...</Text>
          </Group>
          <Grid justify="center" style={{ height: 500 }} gutter="xl">
            <Grid.Col span={8}>
              <PlayerList />
            </Grid.Col>
          </Grid>
        </Container>
      </div>
    );
  }

  if (!!lobby.currentRound.startedAt && !lobby.currentRound.endedAt)
    return (
      <PlayerGameProvider>
        <Navbar />
        <PlayerGameView />
      </PlayerGameProvider>
    );

  if (!!lobby.currentRound.startedAt && !!lobby.currentRound.endedAt)
    return <div>Has already started, and also ended</div>;

  return <div>Undefined</div>;
}
