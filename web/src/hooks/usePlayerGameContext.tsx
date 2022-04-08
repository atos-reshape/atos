import { createContext, useEffect, useState } from 'react';
import { useGetCards } from '../api/requests/card';

const PlayerGameContext = createContext<any>(null);
export { PlayerGameContext };

interface Card {
  text: string;
}

export const PlayerGameProvider = ({ children }: any) => {
  const [carouselCards, setCarouselCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  useGetCards({
    onError: () => alert('Could not fetch cards'),
    onSuccess: (data: any) => {
      setCarouselCards(data);
    }
  });

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
