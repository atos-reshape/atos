import { Container, Group, Button, Text } from '@mantine/core';
import CardTemplate from '../Card/Card';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { PlayerGameContext } from '../../hooks/usePlayerGameContext';
import styles from './PlayerGameView.module.css';

function PlayerGameView2() {
  const { carouselCards, setCarouselCards } = useContext(PlayerGameContext);
  const [index, setIndex] = useState(0);

  async function dislike() {
    if (carouselCards) {
      setCarouselCards(
        carouselCards.filter((card: unknown, localIndex: number) => {
          return localIndex !== index;
        })
      );
      if (index === carouselCards.length - 1) setIndex(index - 1);
    }
  }
  function like() {
    if (carouselCards && index < carouselCards.length - 1) setIndex(index + 1);
    else setIndex(0);
  }
  return (
    <Container
      size="xs"
      style={{
        justifyContent: 'center',
        marginTop: '100px',
        marginInline: '34vw'
      }}
    >
      <Group direction="column">
        <Text className={styles.title}>Personal Color Phase</Text>
        <Text className={styles.description}>
          select the cards that best describe you as a person
        </Text>
        <CardTemplate
          CardText={
            carouselCards[index] !== undefined
              ? carouselCards[index].text
              : 'loading'
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
      </Group>
    </Container>
  );
}

export default PlayerGameView2;
