import { Card, Button } from '@mantine/core';
import { useState } from 'react';
import styles from './DrawerCard.module.css';
import { FaTrash } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
type CardProps = {
  CardText: string;
  deleteCard: (cardText: string) => void;
};

function DrawerCard(props: CardProps) {
  const { CardText, deleteCard } = props;
  const fontSize = CardText.split(' ').length > 20 ? '0.75rem' : '1rem';

  return (
    <>
      {CardText.length > 0 && (
        <Card p="xl" className={styles.card} style={{ fontSize: fontSize }}>
          <Card.Section className={styles.cardtext}>{CardText}</Card.Section>
          <Card.Section className={styles.trashcanbg}>
            <ImCross
              className={styles.trashcan}
              onClick={() => deleteCard(CardText)}
            />
          </Card.Section>
        </Card>
      )}
    </>
  );
}

export default DrawerCard;
