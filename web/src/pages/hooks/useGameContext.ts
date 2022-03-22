import { useState } from 'react';

export const useGameContext = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [timer, setTimer] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>('');
  const [selectedCardset, setSelectedCardset] = useState<string | null>('');

  const addCard = (card: any) => {
    setCards((oldCards: any[]) => {
      return [...oldCards, card];
    });
  };

  const removeCard = (id: any) => {
    setCards((oldCards: any[]) => {
      return oldCards.filter((card) => card.cardId !== id);
    });
  };

  return {
    cards,
    title,
    setTitle,
    timer,
    setTimer,
    selectedCard,
    setSelectedCard,
    selectedCardset,
    setSelectedCardset,
    addCard,
    removeCard
  };
};
