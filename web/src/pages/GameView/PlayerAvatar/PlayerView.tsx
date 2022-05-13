import { PlayerAvatar } from './PlayerAvatar';
import { Box, Group, Text, useMantineTheme } from '@mantine/core';
import { Player } from './../../../api/models/Player';

export function PlayerView({ player }: { player: Player }) {
  const theme = useMantineTheme();

  return (
    <Group style={{ margin: 16 }}>
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
}
