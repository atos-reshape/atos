import { useContext } from 'react';
import { GameContext } from './contexts/GameProvider';
import { Player } from './../../api/models/Player';
import { Box, Group, List, useMantineTheme, Text } from '@mantine/core';
import { PlayerAvatar } from './PlayerAvatar/PlayerAvatar';

export function PlayerList() {
  const { players } = useContext(GameContext);
  const theme = useMantineTheme();
  console.log(players);
  return (
    <List
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
      <Text style={{ margin: 4, borderBottom: '1px solid #e9ecef' }}>
        Joined players ({players.length}/8)
      </Text>
      {players.map((player: Player) => {
        return (
          <Group style={{ margin: 16 }} key={player.id}>
            <PlayerAvatar player={player} />
            <Box sx={{ flex: 1 }}>
              <Text
                size="sm"
                weight={500}
                color={theme.colorScheme === 'dark' ? 'dimmed' : ''}
              >
                {player.name}
              </Text>
            </Box>
          </Group>
        );
      })}
    </List>
  );
}
