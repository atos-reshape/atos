import { Container, Group, Button, Text, Drawer, Card } from '@mantine/core';
import CardTemplate from '../Card/Card';
import DrawerCard from '../DrawerCard/DrawerCard';
import { FaThumbsDown, FaThumbsUp, FaGreaterThan } from 'react-icons/fa';

import { useContext, useEffect, useState } from 'react';
import { PlayerGameContext } from '../../hooks/usePlayerGameContext';
import styles from './PlayerGameView.module.css';

function PlayerGameView2() {
  const { carouselCards, selectedCards, setSelectedCards } =
    useContext(PlayerGameContext);
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);

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
      <FaGreaterThan
        className={styles.drawerarrow}
        onClick={() => setOpened(true)}
      />
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

        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          title="Selected Cards"
          padding="xl"
          size="xl"
          transition="rotate-left"
          transitionDuration={250}
          transitionTimingFunction="ease"
          lockScroll={false}
          className={styles.drawer}
        >
          {selectedCards?.map((card: any) => {
            return (
              <DrawerCard
                CardText={card.text}
                deleteCard={removeDrawerCard}
                key={card.id}
              />
            );
          })}
          <Button className={styles.submitbtn} onClick={() => submitAnswer()}>
            Submit Answer
          </Button>
        </Drawer>
      </Group>
    </Container>
  );
}

export default PlayerGameView2;
