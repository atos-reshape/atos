import { Container, Group, Button, Text } from '@mantine/core';
import CardTemplate from '../Card/Card';
import { FaGrinAlt, FaRegFrown } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { PlayerGameContext } from '../../hooks/usePlayerGameContext';
import styles from './PlayerGameView.module.css';
import DrawerComponent from '../Drawer/Drawer';
import {
  useFinishSelecting,
  useLikeCard,
  useUnLikeCard
} from '../../api/requests/selectedCards';
import { SocketContext } from '../../hooks/useSocketContext';
import { Card } from '../../api/requests/card';
import { GameContext } from '../../pages/GameView/contexts/GameProvider';

function PlayerGameView2() {
  const { carouselCards, selectedCards, setSelectedCards } =
    useContext(PlayerGameContext);
  const { lobby } = useContext(GameContext);
  const [index, setIndex] = useState(0);
  const likeCard = useLikeCard(String(lobby.currentRound.id));
  const unLikeCard = useUnLikeCard(String(lobby.currentRound.id));
  const finishSelecting = useFinishSelecting(String(lobby.currentRound.id));

  const renderedCards = carouselCards.filter(
    (card: any) => !selectedCards.includes(card)
  );

  function dislike() {
    setIndex(index + 1);
  }
  function like() {
    likeCard(renderedCards[index].id).then(() => {
      if (renderedCards && index < renderedCards.length) {
        setSelectedCards((selectedCards: any) => [
          ...selectedCards,
          renderedCards[index]
        ]);
      }
    });
  }

  function removeDrawerCard(deletedCardText: string) {
    const id = selectedCards.find((c: Card) => c.text === deletedCardText)?.id;

    unLikeCard(id).then(() => {
      setSelectedCards((selectedCards: any) => {
        return selectedCards.filter(
          (card: Card) => card.text !== deletedCardText
        );
      });
    });
  }

  function submitAnswer() {
    finishSelecting().then(() => {
      window.location.href = `/results`;
    });
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
          <Button className={styles.likeButton} onClick={like}>
            <FaGrinAlt />
          </Button>
          <Button className={styles.dislikeButton} onClick={dislike}>
            <FaRegFrown />
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
