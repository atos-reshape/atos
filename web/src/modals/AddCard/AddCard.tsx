import { useState, useContext } from 'react';
import { Modal, Group, Button, TextInput } from '@mantine/core';
import Context from '../../pages/context/Context';
import { useGetCards } from '../../api/requests/card';
import { useCreateCard } from '../../api/requests/createcard';

function AddCard() {
  const [opened, setOpened] = useState(false);
  const [content, setContent] = useState('');
  const { cards, addCard, selectedCardset } = useContext(Context);
  const pulledCards = useGetCards();
  const createCard = useCreateCard();
  function addCardToSet() {
    if (addCard) {
      createCard.mutate(
        {
          text: content
        },
        {
          onSuccess: async (data) => {
            addCard(data);
          }
        }
      );

      //addCard(newCard);
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
