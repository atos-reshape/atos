import { useState } from 'react';
import { Button, Container, Group, TextInput } from '@mantine/core';
import { useJoinGame } from '../../api/requests/joingame';
function JoinGame() {
  const [gameCode, setGameCode] = useState('');
  const joinGameMutation = useJoinGame(gameCode);
  function joinGame() {
    joinGameMutation.mutate({}, { onSuccess: (res) => console.log(res) });
  }
  return (
    <Container size="xs">
      <Group direction="column" position="center">
        <TextInput
          placeholder="Game Code"
          label="Game Code"
          required
          value={gameCode}
          onChange={
            setGameCode
              ? (event) =>
                  setGameCode(event.currentTarget.value.toLocaleUpperCase())
              : undefined
          }
        />
        <Button onClick={joinGame}>Join Game</Button>
      </Group>
    </Container>
  );
}

export default JoinGame;
