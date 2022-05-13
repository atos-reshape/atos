import { PlayerAvatar } from './PlayerAvatar';
import { Box, Group, List, Text, useMantineTheme } from '@mantine/core';
import { Player } from '../../api/models';
import { DisplayCard } from '../../pages/admin/GameView/components/DisplayCard';

export function PlayerView({
  player,
  cardIds
}: {
  player: Player;
  cardIds?: string[];
}) {
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

      {cardIds && (
        <List style={{ marginTop: 12, flexGrow: 1 }}>
          {cardIds.map((cardId) => {
            return <DisplayCard id={cardId} key={cardId} />;
          })}
        </List>
      )}
    </Group>
  );
}
