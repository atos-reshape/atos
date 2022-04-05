import { Card, Text } from '@mantine/core';
import './Card.css';
import { useDrag } from 'react-dnd';
type CardProps = {
  CardText: string;
};

function CardTemplate(props: CardProps) {
  const { CardText } = props;
  const fontSize = CardText.split(' ').length > 20 ? '0.75rem' : '1rem';

  const [{ isDragging }, dragRef] = useDrag({
    type: 'card',
    item: { CardText },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  return (
    <>
      {CardText.length > 0 && (
        <Card
          p="xl"
          className="card"
          style={{ fontSize: fontSize }}
          ref={dragRef}
        >
          <Card.Section className="cardtext">{CardText}</Card.Section>
        </Card>
      )}
    </>
  );
}

export default CardTemplate;
