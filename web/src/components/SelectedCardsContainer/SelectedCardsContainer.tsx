import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Container, Group } from '@mantine/core';
import CardTemplate from '../../components/Card/Card';

function SelectedCardsContainer() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [{ isOver }, dropRef] = useDrop({
    accept: 'card',
    drop: (item: any) => {
      setSelectedCards((selectedCards: any) =>
        !selectedCards.includes(item) ? [...selectedCards, item] : selectedCards
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });
  console.log(selectedCards);
  return (
    <Container size="md" className="selectedCards" ref={dropRef}>
      <h4>selected cards</h4>

      <div>
        {selectedCards?.map((card: any, index: number) => {
          return <CardTemplate CardText={card.CardText} key={index} />;
        })}
      </div>
      {isOver && <div>Drop Here!</div>}
    </Container>
  );
}

export default SelectedCardsContainer;
