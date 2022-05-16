import { useContext } from 'react';
import { GameContext } from './contexts/GameProvider';
import { Button, Tabs, Text } from '@mantine/core';
import { useStartRound } from '../../../api/requests/rounds';
import { SelectedCards } from './components/SelectedCards';
import styles from './GameSettings.module.css';

export function GameSettings(): JSX.Element {
  const { lobby } = useContext(GameContext);
  const start = useStartRound(lobby.currentRound.id);

  return (
    <Tabs
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
        borderRadius: 12,
        height: '100%',
        padding: 12
      })}
    >
      <Tabs.Tab label="Game">
        <Text className={styles.black}>Lobby Code: {lobby.code}</Text>
        <Text className={styles.black} style={{ color: 'black' }}>
          Lobby Title: {lobby.title}
        </Text>
      </Tabs.Tab>
      <Tabs.Tab label="Next Round">
        <Button onClick={() => start.mutate({})}>Start round</Button>
      </Tabs.Tab>
      <Tabs.Tab label="Cards">
        <SelectedCards />
      </Tabs.Tab>
    </Tabs>
  );
}
