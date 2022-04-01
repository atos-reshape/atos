import { useState } from 'react';
import { Button, Container, Group, TextInput } from '@mantine/core';
import { useJoinGame } from '../../api/requests/joingame';
function JoinGame() {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const joinGameMutation = useJoinGame(gameCode);

  function joinGame() {
    joinGameMutation.mutate(
      { name: playerName },
      {
        onSuccess: (res) => {
          localStorage.setItem('accessTokenAtos', res.accessToken);
          window.location.href = '/game';
        },
        onError: (res) => {
          alert(res.message);
        }
      }
    );
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

        <TextInput
          placeholder="Player Name"
          label="Player Name"
          required
          value={playerName}
          onChange={
            setPlayerName
              ? (event) => setPlayerName(event.currentTarget.value)
              : undefined
          }
        />
        <Button onClick={joinGame}>Join Game</Button>
      </Group>
    </Container>
  );
}

export default JoinGame;
