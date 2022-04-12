import { Card, Text } from '@mantine/core';
import './CardNoDrag.css';
type CardProps = {
  CardText: string;
};

function CardTemplate(props: CardProps) {
  const { CardText } = props;
  const fontSize = CardText.split(' ').length > 20 ? '1rem' : '1.25rem';

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
