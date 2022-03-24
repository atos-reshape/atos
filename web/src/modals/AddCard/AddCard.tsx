import { useState, useContext } from 'react';
import { Modal, Group, Button, TextInput } from '@mantine/core';
import Context from '../../pages/context/Context';
import { useGetCards } from '../../api/requests/card';

function AddCard() {
  const [opened, setOpened] = useState(false);
  const [content, setContent] = useState('');
  const { cards, addCard, selectedCardset } = useContext(Context);
  const pulledCards = useGetCards();

  function addCardToSet() {
    if (addCard) {
      addCard({
        cardId: (cards.length + 2).toString(),
        cardContent: content,
        cardPreset: selectedCardset
      });
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
          <TextInput
            label="Card Content"
            placeholder="Card Content"
            required
            value={content}
            onChange={(event) => setContent(event.currentTarget.value)}
          />

          <Button onClick={addCardToSet}>Add Card To Game Instance</Button>
        </Group>
      </Modal>

      <Button onClick={() => setOpened(true)}>Add Card</Button>
    </>
  );
}

export default AddCard;
