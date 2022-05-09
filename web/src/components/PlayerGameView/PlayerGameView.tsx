import { Container, Group, Button, Text, Drawer, Card } from '@mantine/core';
import CardTemplate from '../Card/Card';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { PlayerGameContext } from '../../hooks/usePlayerGameContext';
import styles from './PlayerGameView.module.css';
import DrawerComponent from '../Drawer/Drawer';

function PlayerGameView2() {
  const { carouselCards, selectedCards, setSelectedCards } =
    useContext(PlayerGameContext);
  const [index, setIndex] = useState(0);

  const renderedCards = carouselCards.filter(
    (card: any) => !selectedCards.includes(card)
  );
  function dislike() {
    setIndex(index + 1);
  }
  function like() {
    if (renderedCards && index < renderedCards.length) {
      setSelectedCards((selectedCards: any) => [
        ...selectedCards,
        renderedCards[index]
      ]);
    }
  }

  function removeDrawerCard(deletedCardText: string) {
    setSelectedCards((selectedCards: any) => {
      return selectedCards.filter((card: any) => card.text !== deletedCardText);
    });
  }

  function submitAnswer() {
    window.location.href = `/results`;
  }
  return (
    <Container size="xs" className={styles.container}>
      <Text className={styles.counter}>{selectedCards.length}</Text>

      <Group direction="column">
        <Text className={styles.title}>Personal Color Phase</Text>
        <Text className={styles.description}>
          select the cards that best describe you as a person
        </Text>
        <CardTemplate
          CardText={
            renderedCards[index] !== undefined
              ? renderedCards[index].text
              : 'You ran out of cards!'
          }
        />
        <Group direction="row">
          <Button style={{ marginLeft: '138px' }} onClick={dislike}>
            <FaThumbsDown />
          </Button>
          <Button onClick={like}>
            <FaThumbsUp />
          </Button>
        </Group>

        <DrawerComponent
          removeDrawerCard={removeDrawerCard}
          submitAnswer={submitAnswer}
        />
      </Group>
    </Container>
  );
}

export default PlayerGameView2;
