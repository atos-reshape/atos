import { useContext, useEffect } from 'react';
import { Container, Group, Select } from '@mantine/core';
import Card from '../../components/Card/Card';
import AddCard from '../../modals/AddCard/AddCard';
import RemoveCard from '../../modals/RemoveCard/RemoveCard';
import Context from '../../pages/context/Context';
import { useGetCards } from '../../api/requests/card';
import AddExistingCard from '../../modals/AddCard/AddExistingCard';

interface CardType {
  value: string;
  label: string;
}

function CardSettings() {
  const { cards, selectedCard, selectedCardset, setSelectedCard } =
    useContext(Context);

  const pulledCards = useGetCards();
  useEffect(() => {
    // const cardsFile = cardsJson.cards
    //   .filter((card) => card.cardsetId === selectedCardset)
    //   .map((card) => {
    //     return {
    //       cardId: card.id,
    //       cardContent: card.content,
    //       cardsetId: card.cardsetId
    //     };
    //   });
    // const pulledCards = axios
    //   .get('http://localhost:3002/api/cards')
    //   .then((response) => {
    //     console.log(response);
    //     const filteredCards = response.data.map((card: any) => {
    //       return {
    //         cardId: card.id,
    //         cardContent: card.text,
    //         cardsetId: selectedCardset
    //       };
    //     });
    //     console.log(filteredCards);
    //     if (addCard) {
    //       filteredCards.splice(0, cards.length);
    //       filteredCards.map((card:any) => addCard(card));
    //     }
    //   });
  }, [selectedCardset]);
  return (
    <Container>
      <Group direction="column">
        <Select
          label="Cards"
          placeholder="Choose card"
          data={
            pulledCards.data?.map((card: any): CardType => {
              return { value: card.id, label: card.text };
            }) || []
          }
          value={selectedCard}
          onChange={setSelectedCard}
        />

        <Card
          CardText={
            cards.find((card) => card.id === selectedCard)?.content || ''
          }
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
