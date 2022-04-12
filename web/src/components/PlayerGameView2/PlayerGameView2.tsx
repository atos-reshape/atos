import { Container, Group, Button } from '@mantine/core';
import CardTemplate from '../../components/CardNoDrag/CardNoDrag';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { PlayerGameContext } from '../../hooks/usePlayerGameContext';

function PlayerGameView2() {
  const { carouselCards, selectedCards, setCarouselCards, setSelectedCards } =
    useContext(PlayerGameContext);
  const [index, setIndex] = useState(0);

  function dislike() {
    if (carouselCards && index > 0) setIndex(index - 1);
    else setIndex(carouselCards.length - 1);
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
        marginInline: '33vw'
      }}
    >
      <Group direction="column">
        <CardTemplate
          CardText={
            carouselCards[index] !== undefined
              ? carouselCards[index].text
              : 'loading'
          }
        />
        <Group direction="row">
          <Button style={{ marginLeft: '140px' }} onClick={dislike}>
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
