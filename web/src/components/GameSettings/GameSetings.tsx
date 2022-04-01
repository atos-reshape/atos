import { Container, Group, TextInput, Button } from '@mantine/core';
import { useContext } from 'react';
import Context from '../../pages/context/Context';
import { useCreateLobby } from '../../api/requests/lobbies';
import { useGetCards } from '../../api/requests/card';

function GameSettings() {
  const pulledCards = useGetCards();
  const createLobby = useCreateLobby();
  const { cards, title, setTitle, timer, setTimer } = useContext(Context);

  function createGame() {
    //send create game request with the needed data
    createLobby.mutate({
      title: title,
      timer: parseTimer(timer),
      cards: cards.map((card: any) => card.id)
    });
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