import React from 'react';
import { Card, Text } from '@mantine/core';
import './Card.css';

type CardProps = {
  CardText: string;
};

function CardTemplate(props: CardProps) {
  const { CardText } = props;
  const fontSize = CardText.split(' ').length > 20 ? '0.75rem' : '1rem';
  return (
    <>
      {CardText.length > 0 && (
        <Card p="xl" className="card" style={{ fontSize: fontSize }}>
          <Card.Section className="cardtext">{CardText}</Card.Section>
        </Card>
      )}
    </>
  );
}

export default CardTemplate;
