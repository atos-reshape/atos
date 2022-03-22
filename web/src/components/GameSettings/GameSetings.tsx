import { Container, Group, TextInput, Button } from '@mantine/core';
import { useState, useContext } from 'react';
import Context from '../../pages/context/Context';

function GameSettings() {
  const { cards, title, setTitle, timer, setTimer } = useContext(Context);

  function createGame() {
    //replace this with send api
    console.log({ name: title, timer: parseTimer(timer), cards: cards });
  }

  function parseTimer(input: string) {
    const list = input.split(':');
    const seconds = parseInt(list[0]) * 60 + parseInt(list[1]);

    return seconds;
  }
  return (
    <>
      <Container>
        <Group direction="column">
          <h1>Game Settings</h1>

          <TextInput
            placeholder="Game Name"
            label="Game Name"
            required
            value={title}
            onChange={
              setTitle
                ? (event) => setTitle(event.currentTarget.value)
                : undefined
            }
          />

          <TextInput
            label="Time For This Round"
            placeholder="mm:ss"
            required
            value={timer}
            onChange={
              setTimer
                ? (event) => setTimer(event.currentTarget.value)
                : undefined
            }
          />

          <Button onClick={createGame}>Create Game Room</Button>
        </Group>
      </Container>
    </>
  );
}

export default GameSettings;
