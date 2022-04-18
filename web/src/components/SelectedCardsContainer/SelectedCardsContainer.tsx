import { useState, useContext } from 'react';
import { useDrop } from 'react-dnd';
import { Container, Group } from '@mantine/core';
import CardTemplate from '../../components/Card/Card';
import { PlayerGameContext } from '../../hooks/usePlayerGameContext';

function SelectedCardsContainer() {
  // const [selectedCards, setSelectedCards] = useState([]);
  const { carouselCards, selectedCards, setCarouselCards, setSelectedCards } =
    useContext(PlayerGameContext);

  const [{ isOver }, dropRef] = useDrop({
    accept: 'card',
    drop: (item: any) => {
      console.log(item);
      const newCard = {
        text: item.CardText
      };
      if (item.source === 'carousel') {
        console.log(selectedCards);
        setSelectedCards((selectedCards: any) =>
          !selectedCards.includes(newCard)
            ? [...selectedCards, newCard]
            : selectedCards
        );
        setCarouselCards(
          carouselCards.filter((card: any) => {
            return card.text !== newCard.text;
          })
        );
      }
      if (item.source === 'selectedfield') {
        return;
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });
  return (
    <Container size="md" className="selectedCards" ref={dropRef}>
      <h4>selected cards</h4>

      <Group direction="row">
        {selectedCards?.map((card: any, index: number) => {
          return (
            <CardTemplate
              CardText={card.text}
              key={index}
              source="selectedfield"
            />
          );
        })}
      </Group>
      {isOver && <div>Drop Here!</div>}
    </Container>
  );
}

export default SelectedCardsContainer;
