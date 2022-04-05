import { Container, Group } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/NavbarGame/Navbar';
import { SocketProvider } from '../../hooks/useSocketContext';
import 'react-multi-carousel/lib/styles.css';
import { DndProvider } from 'react-dnd';
import { PlayerGameProvider } from '../../hooks/usePlayerGameContext';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './GameView.css';
import SelectedCardsContainer from '../../components/SelectedCardsContainer/SelectedCardsContainer';
import Carousel from '../../components/Carousel/Carousel';

function GameView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { data } = useGetCards({
    onError: () => alert('Could not fetch cards')
  });
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <SocketProvider id={id}>
        <PlayerGameProvider>
          <Navbar />
          <Container size="md">
            <Carousel />
            <SelectedCardsContainer />
          </Container>
        </PlayerGameProvider>
      </SocketProvider>
    </DndProvider>
  );
}

export default GameView;
