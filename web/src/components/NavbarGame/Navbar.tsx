import { Container, Group, Text } from '@mantine/core';
import { SocketContext } from '../../hooks/useSocketContext';
import { useContext } from 'react';
import styles from './Navbar.module.css';
import { GameContext } from '../../pages/GameView/contexts/GameProvider';

function Navbar() {
  const { lobby } = useContext(GameContext);
  return (
    <Container fluid className={styles.container}>
      <Container size="sm">
        <Group grow>
          <Text className={styles.text}>Lobby Name : {lobby.title}</Text>
          <Text className={styles.text}>Code: {lobby.code}</Text>
        </Group>
      </Container>
    </Container>
  );
}

export default Navbar;
