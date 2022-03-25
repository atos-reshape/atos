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
  const {
    cards,
    setCards,
    selectedCard,
    selectedCardset,
    setSelectedCard,
    addCard
  } = useContext(Context);

  const [transferListData, setTransferListData] = useState<TransferListData>([
    [{ value: 'Loading', label: 'Loading', content: 'cardtest1' }],
    [{ value: 'Loading', label: 'Loading', content: 'cardtest2' }]
  ]);
  useEffect(() => {
    // transferListData[0] = cards
    //   ?.filter((card) => card.manuallyAdded === undefined)
    //   .map((card) => {
    //     return { value: card.id, label: card.text };
    //   });
    // transferListData[1] = cards?.filter((card) => card.manuallyAdded === true);
    console.log(cards);
  }, [cards]);

  function setNewCards(value: any) {
    if (addCard) addCard({ id: value.value, text: value.label });
    setTransferListData(value);
    console.log(cards, transferListData);
  }
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

        <TransferList
          value={transferListData}
          onChange={setNewCards}
          titles={['Selected Cards for the Round', 'Manually added cards']}
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
