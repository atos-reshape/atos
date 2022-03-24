import { createContext } from 'react';

// const CardDefault = [{ cardId: '', cardContent: '', cardsetId: '' }];
interface ContextType {
  cards: any[];
  setCards?: React.Dispatch<React.SetStateAction<any[]>>;
  title: string;
  timer: string;
  selectedCard: string | null;
  selectedCardset: string | null;
  setSelectedCard?: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCardset?: React.Dispatch<React.SetStateAction<string | null>>;
  setTimer?: React.Dispatch<React.SetStateAction<string>>;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  addCard?: (card: any) => void;
  removeCard?: (id: string) => void;
}

const Context = createContext<ContextType>({
  cards: [],
  title: '',
  timer: '',
  selectedCard: '',
  selectedCardset: ''
});
export default Context;
