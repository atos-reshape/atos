import { Box, Center, Image, List, Loader, Text, Title } from '@mantine/core';
import styles from './AtosLoadingScreen.module.css';

export function AtosLoadingScreen() {
  return (
    <Center>
      <Box className={styles.core}>
        <Center>
          <List>
            <Image className="logo" src={'/Atos_logo_blue_RGB.png'} />
            <Title className={styles.title}>Re.Shape</Title>
            <Loader className={styles.loader} />
            <Text align="center">Loading</Text>
          </List>
        </Center>
      </Box>
    </Center>
  );
}
