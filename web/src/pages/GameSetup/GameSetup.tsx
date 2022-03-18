import React, { useState, useEffect } from 'react';
import { Container, Group, Select, Button, Tabs } from '@mantine/core';
import Card from '../../components/Card/Card';
import AddCard from '../../modals/AddCard/AddCard';
import GameSettings from '../../components/GameSettings/GameSetings';
import './GameSetup.css';
import cardsJson from '../../cards.json';

interface CardType {
  value: string;
  label: string;
}
export default function GameSetup(): JSX.Element {
  const [selectedCard, setSelectedCard] = useState<string | null>('');
  const [selectedCardset, setSelectedCardset] = useState<string | null>('');
  const [gameCards, setGameCards] = useState([
    { cardId: '', cardContent: '', cardsetId: '' }
  ]);

  useEffect(() => {
    const cards = cardsJson.cards
      .filter((card) => card.cardsetId === selectedCardset)
      .map((card) => {
        return {
          cardId: card.id,
          cardContent: card.content,
          cardsetId: card.cardsetId
        };
      });

    setGameCards(cards);
    console.log(cards);
  }, [selectedCardset]);

  return (
    <Container size="xs">
      <Tabs>
        <Tabs.Tab label="Game Settings">
          <GameSettings cards={gameCards} />
        </Tabs.Tab>

        <Tabs.Tab label="Card Settings">
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
                  cardsJson.cards.find((card) => card.id === selectedCard)
                    ?.content || ''
                }
              />
              <Group>
                <AddCard />
                <Button>Remove card</Button>
                <Button>Edit card</Button>
              </Group>
            </Group>
          </Container>
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
}
