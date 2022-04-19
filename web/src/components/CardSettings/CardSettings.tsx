import { useContext, useEffect, useState } from 'react';
import { Container, Group, Select } from '@mantine/core';
import Card from '../Card/Card';
import AddCard from '../../modals/AddCard/AddCard';
import RemoveCard from '../../modals/RemoveCard/RemoveCard';
import Context from '../../context/Context';
import AddExistingCard from '../../modals/AddCard/AddExistingCard';
import { useGetCards } from '../../api/requests/card';
import styles from './CardSettings.module.css';

interface CardType {
  value: string;
  label: string;
}

function CardSettings() {
  const { selectedCard, selectedCardset, setSelectedCard } =
    useContext(Context);

  const { data } = useGetCards({
    onError: () => alert('Could not fetch cards')
  });
  return (
    <Container>
      <Group direction="column" className={styles.container}>
        <Select
          label="Card sets"
          placeholder="Choose card"
          data={
            data?.map((card: any): CardType => {
              return { value: card.id, label: card.text };
            }) || []
          }
          value={selectedCard}
          onChange={setSelectedCard}
        />

        <Group>
          {/* <AddCard /> */}
          <AddExistingCard />
          <RemoveCard />
        </Group>

        {data
          ? data.map((card: any) => {
              return <Card CardText={card.text} key={card.id} />;
            })
          : null}
      </Group>
    </Container>
  );
}

export default CardSettings;
