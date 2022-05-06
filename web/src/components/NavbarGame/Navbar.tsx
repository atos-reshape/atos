import { Container, Group, Text } from '@mantine/core';
import { SocketContext } from '../../hooks/useSocketContext';
import { useContext } from 'react';
import styles from './Navbar.module.css';

function Navbar() {
  const lobby = useContext(SocketContext);
  return (
    <Container fluid className={styles.container}>
      <Container size="sm">
        <Group grow>
          <Text className={styles.text}>
            Lobby Name :{' '}
            {lobby.state !== undefined ? lobby.state.title : 'loading'}
          </Text>
          <Text className={styles.text}>
            Code: {lobby.state !== undefined ? lobby.state.code : 'loading'}
          </Text>
        </Group>
      </Container>
    </Container>
  );
}

export default Navbar;
