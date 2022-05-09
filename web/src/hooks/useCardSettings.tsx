import { createContext, useState } from 'react';
import { useGetCards } from '../api/requests/card';

const CardSettingsContext = createContext<any>(null);
export { CardSettingsContext };

interface Card {
  text: string;
}

export const CardSettingsProvider = ({ children }: any) => {
  const [cardsets, setCardsets] = useState(0);

  useGetCards({
    onError: () => alert('Could not fetch cards'),
    onSuccess: (data: any) => {
      console.log(data);
    }
  });

  return (
    <CardSettingsContext.Provider
      value={{
        cardsets,
        setCardsets
      }}
    >
      {children}
    </CardSettingsContext.Provider>
  );
};
