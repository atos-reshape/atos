import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SelectedCardsContainer from '../../components/SelectedCardsContainer/SelectedCardsContainer';
import Carousel from '../../components/Carousel/Carousel';
import 'react-multi-carousel/lib/styles.css';
import { Container } from '@mantine/core';
function PlayerGameView1() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Container size="md">
        <Carousel />
        <SelectedCardsContainer />
      </Container>
    </DndProvider>
  );
}

export default PlayerGameView1;
