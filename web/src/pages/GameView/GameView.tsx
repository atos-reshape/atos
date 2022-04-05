import { Container, Group } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useGetCards } from '../../api/requests/card';
import CardTemplate from '../../components/Card/Card';
import Navbar from '../../components/NavbarGame/Navbar';
import { SocketProvider } from '../../hooks/useSocketContext';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { DndProvider, useDrop } from 'react-dnd';

import { HTML5Backend } from 'react-dnd-html5-backend';
import './GameView.css';
import SelectedCardsContainer from '../../components/SelectedCardsContainer/SelectedCardsContainer';

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
        <Navbar />
        <Container size="md">
          <Carousel
            showDots={false}
            responsive={responsive}
            autoPlay={false}
            infinite={true}
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            itemClass="carousel-item-padding-40-px"
            focusOnSelect={true}
            shouldResetAutoplay={false}
            // customLeftArrow={<CustomLeftArrow myOwnStuff="smth" />}
            // customRightArrow={<CustomRightArrow myOwnStuff="smth" />}
          >
            {data !== undefined ? (
              data?.map((card: any, index: number) => {
                return (
                  <>
                    <CardTemplate CardText={card.text} key={index} />{' '}
                  </>
                );
              })
            ) : (
              <div>loading</div>
            )}
          </Carousel>
          <SelectedCardsContainer />
        </Container>
      </SocketProvider>
    </DndProvider>
  );
}

export default GameView;
