import { useContext, useState } from 'react';
import { GameContext } from '../contexts/GameProvider';
import { Card, useGetCards } from '../../../api/requests/card';
import { useUpdateCardsOfRound } from '../../../api/requests/rounds';
import { Button, Group, List, Select, Text } from '@mantine/core';
import { DisplayCard } from './DisplayCard';

export const SelectedCards = () => {
  const {
    lobby: { currentRound: round },
    addCard
  } = useContext(GameContext);
  const { data } = useGetCards();
  const update = useUpdateCardsOfRound(round.id);
  const [content, setContent] = useState<string | null>('');

  const selectables =
    data
      ?.filter(({ id }: { id: string }) => !round.cards.includes(id))
      .map(({ id: value, text: label }: Card): unknown => ({ value, label })) ||
    [];

  const submitNewCard = () => (content ? addCard(content) : null);
  const onSubmitCards = () => update.mutate({ cards: round.cards });

  return (
    <List>
      <Text>Selected cards: {round.cards.length} Total</Text>

      <List style={{ marginTop: 12, flexGrow: 1 }}>
        {round.cards.map((cardId) => {
          return <DisplayCard id={cardId} key={cardId} />;
        })}
      </List>

      <Group position="right" style={{ marginTop: 16 }}>
        <Select
          style={{ width: 'calc(100% - 205px)' }}
          placeholder="Choose card to be added"
          data={selectables}
          onChange={setContent}
        />
        <Button style={{ width: 73 }} onClick={submitNewCard}>
          Add
        </Button>
        <Button style={{ width: 100 }} onClick={onSubmitCards}>
          Confirm
        </Button>
      </Group>
    </List>
  );
};
