import DrawerCard from '../DrawerCard/DrawerCard';
import { Drawer, Button } from '@mantine/core';
import styles from './Drawer.module.css';
import { useContext, useState } from 'react';
import { PlayerGameContext } from '../../hooks/usePlayerGameContext';
import { FaGreaterThan } from 'react-icons/fa';

interface PropsType {
  removeDrawerCard: (text: string) => void;
  submitAnswer: () => void;
}
function DrawerComponent(props: PropsType) {
  const [opened, setOpened] = useState(false);
  const { selectedCards } = useContext(PlayerGameContext);
  const { removeDrawerCard, submitAnswer } = props;
  return (
    <>
      <FaGreaterThan
        className={styles.drawerarrow}
        onClick={() => setOpened(true)}
      />
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Selected Cards"
        padding="xl"
        size="xl"
        transition="rotate-left"
        transitionDuration={250}
        transitionTimingFunction="ease"
        lockScroll={false}
        className={styles.drawer}
      >
        {selectedCards?.map((card: any) => {
          return (
            <DrawerCard
              CardText={card.text}
              deleteCard={removeDrawerCard}
              key={card.id}
            />
          );
        })}
        <Button className={styles.submitbtn} onClick={() => submitAnswer()}>
          Submit Answer
        </Button>
      </Drawer>
    </>
  );
}

export default DrawerComponent;
