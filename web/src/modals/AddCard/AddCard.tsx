import { useState, useContext } from 'react';
import { Modal, Group, Button, TextInput } from '@mantine/core';
import Context from '../../context/Context';
import { useCreateCard } from '../../api/requests/createcard';

function AddCard() {
  const [opened, setOpened] = useState(false);
  const [content, setContent] = useState('');
  const createCard = useCreateCard();
  function addCardToSet() {
    createCard.mutate(
      {
        text: content
      },
      {
        onSuccess: async (data) => {
          alert(`Created card ${data.id} with text ${data.text}`);
        }
      }
    );
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
