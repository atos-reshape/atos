import { useState, useEffect } from 'react';
import * as React from 'react';
import { useInterval } from '@mantine/hooks';
import {
  createStyles,
  Select,
  TextInput,
  Button,
  Progress,
  MantineProvider,
  InputWrapper,
  Group,
  Input,
  Container,
  Tabs
} from '@mantine/core';
import { JsxElement } from 'typescript';
import axios from 'axios';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative'
  },

  progress: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    left: -1,
    top: -1,
    height: 'auto',
    backgroundColor: 'transparent',
    zIndex: 0
  },

  button: {
    position: 'relative',
    transition: 'background-color 150ms ease'
  },

  input: {
    height: 'auto',
    paddingTop: 18
  },

  label: {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1
  },

  label2: {
    position: 'relative',
    zIndex: 1
  }
}));

export default function CardUpdates(): JSX.Element {
  const { classes, theme } = useStyles();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [cards, setCards] = useState<any | null>(null);
  const [cardsNames, setCardsNames] = useState<any | null>(null);
  const [pickedCard, setPickedCard] = useState<any | null>(null);
  const [textInput, setTextInput] = React.useState('');

  const updateCardsList = async () => {
    await fetch('http://localhost:3000/api/cards', {}).then(
      async (response: any) => {
        const data = await response.json();
        const cardNames = [];
        for (let i = 0; i < Object.keys(data).length; i++) {
          console.log(data[i]);
          cardNames.push({ value: data[i].text, label: data[i].text });
        }
        setCardsNames(cardNames);
        setCards(data);
      }
    );
  };

  useEffect(() => {
    updateCardsList();
  }, []);

  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }

        interval.stop();
        setLoaded(true);
        // window.location.reload();
        return 0;
      }),
    10
  );

  const handleClickAdd = async () => {
    const data = { text: textInput };
    await fetch('http://localhost:3000/api/cards/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8' // Indicates the content
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.text()) // or res.json()
      .then((res) => console.log(res));
    updateCardsList();
  };

  const handleClickUpdate = async () => {
    const data = { text: textInput };
    let id = '';
    console.log(JSON.stringify(data));
    console.log(pickedCard);
    for (let i = 0; i < Object.keys(cards).length; i++) {
      if (cards[i].text == pickedCard) {
        id = cards[i].id;
      }
    }
    await fetch('http://localhost:3000/api/cards/' + id, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8' // Indicates the content
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.text()) // or res.json()
      .then((res) => console.log(res));
    updateCardsList();
  };

  const handleClickRemove = async () => {
    const data = { text: textInput };
    let id = '';
    console.log(JSON.stringify(data));
    console.log(pickedCard);
    for (let i = 0; i < Object.keys(cards).length; i++) {
      if (cards[i].text == pickedCard) {
        id = cards[i].id;
      }
    }
    await fetch('http://localhost:3000/api/cards/' + id, {
      method: 'DELETE'
    })
      .then((res) => res.text()) // or res.json()
      .then((res) => console.log(res));
    updateCardsList();
  };

  const handleChange = (event: any) => {
    setTextInput(event.target.value);
  };

  return (
    <div>
      <Tabs position="center">
        <Tabs.Tab label="Add a new card">
          <Group position="center" direction="column">
            <Container size={400} style={{ marginTop: 30 }}>
              <TextInput
                style={{ marginTop: 20, width: 400 }}
                size="sm"
                radius="md"
                label="Card name"
                placeholder="The name of your card"
                classNames={classes}
                onChange={handleChange}
              />
              <TextInput
                style={{ marginTop: 20, width: 400 }}
                size="sm"
                radius="md"
                label="Card text english"
                placeholder="You like making others win"
                classNames={classes}
              />
              <TextInput
                style={{ marginTop: 20, width: 400 }}
                size="sm"
                radius="md"
                label="Card text dutch"
                placeholder="Je houdt ervan om anderen te laten winnen"
                classNames={classes}
              />
            </Container>
            <Button
              className={classes.button}
              onClick={() => {
                handleClickAdd();
                loaded
                  ? setLoaded(false)
                  : !interval.active && interval.start();
              }}
              color={loaded ? 'teal' : theme.primaryColor}
              style={{ marginTop: 20 }}
            >
              <div className={classes.label2}>
                {progress !== 0
                  ? 'Adding card...'
                  : loaded
                  ? 'Card added'
                  : 'Add new card'}
              </div>
              {progress !== 0 && (
                <Progress
                  value={progress}
                  className={classes.progress}
                  color={theme.fn.rgba(
                    theme.colors[theme.primaryColor][2],
                    0.35
                  )}
                  radius="lg"
                />
              )}
            </Button>
          </Group>
        </Tabs.Tab>
        <Tabs.Tab label="Update a card">
          <Group position="center" direction="column">
            <Container size={400}>
              <Select
                style={{ marginTop: 50, width: 400 }}
                data={cardsNames}
                placeholder="Your card"
                label="Pick the card you want to update"
                classNames={classes}
                radius="md"
                value={pickedCard}
                onChange={setPickedCard}
              />
              {/* <Container size={400}> */}
              <TextInput
                style={{ marginTop: 20, width: 400 }}
                size="sm"
                radius="md"
                label="Card name"
                placeholder="The name of your card"
                classNames={classes}
                onChange={handleChange}
              />
              <TextInput
                style={{ marginTop: 20, width: 400 }}
                size="sm"
                radius="md"
                label="Card text english"
                placeholder="You like making others win"
                classNames={classes}
              />
              <TextInput
                style={{ marginTop: 20, width: 400 }}
                size="sm"
                radius="md"
                label="Card text dutch"
                placeholder="Je houdt ervan om anderen te laten winnen"
                classNames={classes}
              />
            </Container>
            <Button
              className={classes.button}
              onClick={() => {
                handleClickUpdate();
                loaded
                  ? setLoaded(false)
                  : !interval.active && interval.start();
              }}
              color={loaded ? 'teal' : theme.primaryColor}
              style={{ marginTop: 20 }}
            >
              <div className={classes.label2}>
                {progress !== 0
                  ? 'Updating card...'
                  : loaded
                  ? 'Card updated'
                  : 'Update card'}
              </div>
              {progress !== 0 && (
                <Progress
                  value={progress}
                  className={classes.progress}
                  color={theme.fn.rgba(
                    theme.colors[theme.primaryColor][2],
                    0.35
                  )}
                  radius="lg"
                />
              )}
            </Button>
          </Group>
        </Tabs.Tab>
        <Tabs.Tab label="Remove a card">
          <Group position="center" direction="column">
            <Container size={400}>
              <Select
                style={{ marginTop: 50, width: 400 }}
                data={cardsNames}
                placeholder="Your card"
                label="Pick the card you want to remove"
                classNames={classes}
                radius="md"
                value={pickedCard}
                onChange={setPickedCard}
              />
              {/* <Container size={400}> */}
            </Container>
            <Button
              className={classes.button}
              onClick={() => {
                handleClickRemove();
                loaded
                  ? setLoaded(false)
                  : !interval.active && interval.start();
              }}
              color={loaded ? 'teal' : theme.primaryColor}
              style={{ marginTop: 20 }}
            >
              <div className={classes.label2}>
                {progress !== 0
                  ? 'Removing card...'
                  : loaded
                  ? 'Card removed'
                  : 'Remove a card'}
              </div>
              {progress !== 0 && (
                <Progress
                  value={progress}
                  className={classes.progress}
                  color={theme.fn.rgba(
                    theme.colors[theme.primaryColor][2],
                    0.35
                  )}
                  radius="lg"
                />
              )}
            </Button>
          </Group>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
