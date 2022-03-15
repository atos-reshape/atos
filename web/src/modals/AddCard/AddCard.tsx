import React, { useState } from 'react';
import { Modal, Group, Button, TextInput } from '@mantine/core';

function AddCard() {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState('');
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce yourself!"
      >
        <Group direction="column">
          <TextInput
            label="Card Text"
            placeholder="Card Text"
            required
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          />

          <Button onClick={() => console.log('added to cardlist')}>
            Add Card To Game Instance
          </Button>
        </Group>
      </Modal>

      <Button onClick={() => setOpened(true)}>Add Card</Button>
    </>
  );
}

export default AddCard;
