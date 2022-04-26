import { Container, Tabs } from '@mantine/core';
import GameSettings from '../../components/GameSettings/GameSetings';
import Context from '../../context/Context';
import { useGameContext } from '../../hooks/useGameContext';

export default function GameSetup(): JSX.Element {
  const context = useGameContext();
  return (
    <Context.Provider value={context}>
      <Container size="xs">
        <Tabs>
          <Tabs.Tab label="Game Settings">
            <GameSettings />
          </Tabs.Tab>
        </Tabs>
      </Container>
    </Context.Provider>
  );
}
