import { useState } from 'react';
import { Button, Container, Group, TextInput, Text } from '@mantine/core';
import { useJoinGame } from '../../api/requests/joingame';
import styles from './JoinGame.module.css';
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
          window.location.href = `/game?id=${res.lobbyId}`;
        },
        onError: (res) => {
          alert(res.message);
        }
      }
    );
  }
  return (
    <Container size="xs" className={styles.container}>
      <Group direction="column" position="center">
        <h1>Join Lobby!</h1>
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
