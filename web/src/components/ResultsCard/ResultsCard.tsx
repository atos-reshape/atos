import { Card } from '@mantine/core';
import styles from './ResultsCard.module.css';
type CardProps = {
  CardText: string;
  CardColor: string;
  CardTextColor: string;
};

function ResultsCard(props: CardProps) {
  const { CardText, CardColor, CardTextColor } = props;
  const fontSize = CardText.split(' ').length > 20 ? '1rem' : '1.25rem';

  return (
    <>
      {CardText.length > 0 && (
        <Card
          p="xl"
          className={styles.card}
          style={{
            fontSize: fontSize,
            backgroundColor: CardColor,
            color: CardTextColor
          }}
        >
          <Card.Section className={styles.cardtext}>{CardText}</Card.Section>
        </Card>
      )}
    </>
  );
}

export default ResultsCard;
