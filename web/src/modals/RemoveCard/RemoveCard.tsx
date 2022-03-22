import { useState, useContext } from 'react';
import { Modal, Group, Button, Select } from '@mantine/core';
import Context from '../../pages/context/Context';
function RemoveCard() {
  const [opened, setOpened] = useState(false);
  const [content, setContent] = useState<string | null>('');
  const { cards, removeCard } = useContext(Context);

  function removeCardFromSet() {
    if (removeCard) {
      const id = cards.find((card) => card.cardContent === content).cardId;
      removeCard(id);
      console.log('Removed at id: ' + id);
    }
  }
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Remove card from game round"
      >
        <Group direction="column">
          <Select
            label="Select Card to be removed"
            placeholder="Choose card to be removed"
            data={
              cards.length == 0
                ? [{ value: 'Loading', label: 'Loading' }]
                : cards.map((card) => {
                    return {
                      key: parseInt(card.cardId),
                      value: card.cardContent,
                      label: card.cardContent
                    };
                  })
            }
            value={content}
            onChange={setContent}
          />
          <Button onClick={removeCardFromSet}>
            Remove Card From Game Instance
          </Button>
        </Group>
      </Modal>

      <Button onClick={() => setOpened(true)}>Remove Card</Button>
    </>
  );
}

export default RemoveCard;
