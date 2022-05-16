import { useSearchParams } from 'react-router-dom';
import { AppShell, Header, MantineTheme, Navbar } from '@mantine/core';
import { SocketProvider } from './contexts/SocketProvider';
import { GameProvider } from './contexts/GameProvider';
import { GameView } from './GameView';

const otherColors = (theme: MantineTheme) => ({
  backgroundColor:
    theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
  borderColor:
    theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
});

export function GameRoute() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  console.log(id);

  return (
    <SocketProvider id={id as string}>
      <GameProvider>
        <AppShell
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
          })}
          style={{ backgroundColor: 'rgb(29, 28, 28)' }}
        >
          <GameView />
        </AppShell>
      </GameProvider>
    </SocketProvider>
  );
}
