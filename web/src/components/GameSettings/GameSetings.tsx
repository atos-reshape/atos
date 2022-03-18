import { Container, Group, TextInput, Button } from '@mantine/core';
import React, { useState } from 'react';

// interface Settings {
//   name: string;
//   timer: int;
// }
interface Props {
  cards: { cardId: string; cardContent: string; cardsetId: string }[];
}

function GameSettings(props: Props) {
  const { cards } = props;
  const [name, setName] = useState('');
  const [timer, setTimer] = useState('');

  function createGame() {
    //replace this with send api
    console.log({ name: name, timer: parseTimer(timer), cards: cards });
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
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />

          <TextInput
            label="Time For This Round"
            placeholder="mm:ss"
            required
            value={timer}
            onChange={(event) => setTimer(event.currentTarget.value)}
          />

          <Button onClick={createGame}>Create Game Room</Button>
        </Group>
      </Container>
    </>
  );
}

export default GameSettings;
