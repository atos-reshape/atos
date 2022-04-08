import { createContext, useEffect, useState } from 'react';

const PlayerGameContext = createContext<any>(null);
export { PlayerGameContext };

interface Card {
  text: string;
}

export const PlayerGameProvider = ({ children }: any) => {
  const [carouselCards, setCarouselCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  return (
    <PlayerGameContext.Provider
      value={{
        carouselCards,
        selectedCards,
        setCarouselCards,
        setSelectedCards
      }}
    >
      {children}
    </PlayerGameContext.Provider>
  );
};
