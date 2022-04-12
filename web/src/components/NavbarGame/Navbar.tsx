import { Container, Group, Text } from '@mantine/core';
import { SocketContext } from '../../hooks/useSocketContext';
import { useContext } from 'react';
import './Navbar.css';

function Navbar() {
  const lobby = useContext(SocketContext);
  return (
    <Container fluid className="container">
      <Container size="sm">
        <Group>
          <Text className="text">
            Lobby name :{' '}
            {lobby.state !== undefined ? lobby.state.title : 'loading'}
          </Text>
          <Text className="text">
            Code: {lobby.state !== undefined ? lobby.state.code : 'loading'}
          </Text>
        </Group>
      </Container>
    </Container>
  );
}

export default Navbar;
