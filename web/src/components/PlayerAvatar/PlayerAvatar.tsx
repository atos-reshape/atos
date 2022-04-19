import { Avatar } from '@mantine/core';
import { useContext } from 'react';
import { ColorContext } from '../../pages/admin/GameView/contexts/GameProvider';
import { Player } from '../../api/models/Player';

export function PlayerAvatar({ player: { id, name } }: { player: Player }) {
  const color = useContext(ColorContext).findColor(id);
  const words = name.split(' ');

  return (
    <Avatar radius="xl" color={color}>
      {words[0].charAt(0) + words.pop()?.charAt(0)}
    </Avatar>
  );
}
