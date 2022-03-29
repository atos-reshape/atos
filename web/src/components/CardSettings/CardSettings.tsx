import { useContext, useEffect, useState } from 'react';
import {
  Container,
  Group,
  Select,
  TransferList,
  TransferListData
} from '@mantine/core';
import Card from '../../components/Card/Card';
import AddCard from '../../modals/AddCard/AddCard';
import RemoveCard from '../../modals/RemoveCard/RemoveCard';
import Context from '../../pages/context/Context';
import AddExistingCard from '../../modals/AddCard/AddExistingCard';

interface CardType {
  value: string;
  label: string;
}

function CardSettings() {
  const { cards, selectedCard, selectedCardset, setSelectedCard } =
    useContext(Context);
  return (
    <Container>
      <Group direction="column">
        <Select
          label="Cards"
          placeholder="Choose card"
          data={
            cards?.map((card: any): CardType => {
              return { value: card.id, label: card.text };
            }) || []
          }
          value={selectedCard}
          onChange={setSelectedCard}
        />

        <Group>
          <AddCard />
          <AddExistingCard />
          <RemoveCard />
        </Group>

        {cards
          ? cards.map((card: any) => {
              return <Card CardText={card.text} />;
            })
          : null}
      </Group>
    </Container>
  );
}

export default CardSettings;
