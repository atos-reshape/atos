import { Card } from '@mantine/core';
import styles from './Card.module.css';
type CardProps = {
  CardText: string;
};

function CardTemplate(props: CardProps) {
  const { CardText } = props;
  const fontSize = CardText.split(' ').length > 20 ? '1rem' : '1.25rem';

  return (
    <>
      {CardText.length > 0 && (
        <Card p="xl" className={styles.card} style={{ fontSize: fontSize }}>
          <Card.Section className={styles.cardtext}>{CardText}</Card.Section>
        </Card>
      )}
    </>
  );
}

export default CardTemplate;
