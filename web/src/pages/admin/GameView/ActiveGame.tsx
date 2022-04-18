import { List, Tabs } from '@mantine/core';
import { useContext } from 'react';
import { GameContext } from './contexts/GameProvider';
import { Player } from '../../../api/models/Player';
import { PlayerView } from '../../../components/PlayerAvatar/PlayerView';

export function ActiveGame() {
  const { players } = useContext(GameContext);

  return (
    <Tabs
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
        borderRadius: 12,
        padding: 12
      })}
    >
      <Tabs.Tab label="Game">
        <List>
          {players.map((player: Player) => {
            // TODO add list of selected cards
            return <PlayerView player={player} key={player.id} />;
          })}
        </List>
      </Tabs.Tab>
    </Tabs>
  );
}
