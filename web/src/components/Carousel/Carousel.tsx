import { useGetCards } from '../../api/requests/card';
import { useContext, useEffect, useState } from 'react';
import CardTemplate from '../../components/Card/Card';
import { Text } from '@mantine/core';
import CarouselComponent from 'react-multi-carousel';
import { useDrop } from 'react-dnd';
import { PlayerGameContext } from '../../hooks/usePlayerGameContext';

function Carousel() {
  const { carouselCards, selectedCards, setCarouselCards, setSelectedCards } =
    useContext(PlayerGameContext);

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
      items: 3
    },
    mobile: {
      breakpoint: { max: 564, min: 0 },
      items: 1
    }
  };

  const [{ isOver }, dropRef] = useDrop({
    accept: 'card',
    drop: (item: any) => {
      const newCard = {
        text: item.CardText
      };
      if (item.source === 'carousel') {
        return;
      }
      if (item.source === 'selectedfield') {
        setCarouselCards((carouselCards: any) =>
          !carouselCards.includes(newCard)
            ? [...carouselCards, newCard]
            : carouselCards
        );
        setSelectedCards(
          selectedCards.filter((card: any) => {
            return card.text !== newCard.text;
          })
        );
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });
  return (
    <div ref={dropRef}>
      <CarouselComponent
        showDots={false}
        responsive={responsive}
        autoPlay={false}
        infinite={true}
        transitionDuration={500}
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
        focusOnSelect={true}
        shouldResetAutoplay={false}
      >
        {isOver && <Text>Drop Here</Text>}
        {carouselCards.length !== 0 ? (
          carouselCards?.map((card: any, index: number) => {
            return (
              <>
                <CardTemplate
                  CardText={card.text}
                  key={index}
                  source="carousel"
                />{' '}
              </>
            );
          })
        ) : (
          <div>loading</div>
        )}
      </CarouselComponent>
    </div>
  );
}

export default Carousel;
