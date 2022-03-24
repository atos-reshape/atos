import { useState, useContext } from 'react';
import { Modal, Group, Button, TextInput, Select } from '@mantine/core';
import Context from '../../pages/context/Context';
import { useGetCards } from '../../api/requests/card';

function AddCard() {
  const [opened, setOpened] = useState(false);
  const [content, setContent] = useState<string | null>('');
  const { cards, addCard, selectedCardset } = useContext(Context);
  const pulledCards = useGetCards();

  function addCardToSet() {
    if (addCard) {
      const card = pulledCards.data.find((card: any) => card.id == content);
      addCard(card);
    }
    console.log(cards);
  }
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add card to game round"
      >
        <Group direction="column">
          <Select
            label="Select Card to be added"
            placeholder="Choose card to be added"
            data={
              pulledCards.data?.map((card: any): any => {
                return { value: card.id, label: card.text };
              }) || []
            }
            value={content}
            onChange={setContent}
          />

          <Button onClick={addCardToSet}>Add Card To Game Instance</Button>
        </Group>
      </Modal>

      <Button onClick={() => setOpened(true)}>Add Card To Round</Button>
    </>
  );
}

export default AddCard;
