import { useState, useEffect } from 'react';
import { useGetCards } from '../../api/requests/card';

export const useGameContext = () => {
  const { data, status } = useGetCards();
  const [cards, setCards] = useState<any[]>(data || []);
  const [title, setTitle] = useState('');
  const [timer, setTimer] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>('');
  const [selectedCardset, setSelectedCardset] = useState<string | null>('');

  useEffect(() => {
    if (status === 'success') setCards(data);
  }, [data]);

  const addCard = (card: any) => {
    console.log(card);
    setCards((oldCards: any[]) => {
      console.log(oldCards);
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
    setCards,
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
