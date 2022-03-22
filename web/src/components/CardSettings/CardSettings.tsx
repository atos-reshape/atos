import { useContext, useEffect, useState } from 'react';
import { Container, Group, Select, Button } from '@mantine/core';
import Card from '../../components/Card/Card';
import AddCard from '../../modals/AddCard/AddCard';
import RemoveCard from '../../modals/RemoveCard/RemoveCard';
import cardsJson from '../../cards.json';
import Context from '../../pages/context/Context';

interface CardType {
  value: string;
  label: string;
}

function CardSettings() {
  const {
    cards,
    addCard,
    selectedCard,
    selectedCardset,
    setSelectedCard,
    setSelectedCardset
  } = useContext(Context);

  useEffect(() => {
    const cardsFile = cardsJson.cards
      .filter((card) => card.cardsetId === selectedCardset)
      .map((card) => {
        return {
          cardId: card.id,
          cardContent: card.content,
          cardsetId: card.cardsetId
        };
      });

    // setGameCards(cards);
    if (addCard) {
      cards.splice(0, cards.length);
      cardsFile.map((card) => addCard(card));
    }
  }, [selectedCardset]);
  return (
    <Container>
      <Group direction="column">
        <h1>Card Settings</h1>
        <Select
          label="Card Set Settings"
          placeholder="Choose card set to edit"
          data={[
            { value: 'preset1', label: 'Preset1' },
            { value: 'preset2', label: 'Preset2' }
          ]}
          value={selectedCardset}
          onChange={setSelectedCardset}
        />
        <Select
          label="Cards"
          placeholder="Choose card"
          data={cardsJson.cards
            .filter((card) => card.cardsetId === selectedCardset)
            .map((card): CardType => {
              return { value: card.id, label: card.id };
            })}
          value={selectedCard}
          onChange={setSelectedCard}
        />

        <Card
          CardText={
            cardsJson.cards.find((card) => card.id === selectedCard)?.content ||
            ''
          }
        />
        <Group>
          <AddCard />
          <RemoveCard />
        </Group>
      </Group>
    </Container>
  );
}

export default CardSettings;
