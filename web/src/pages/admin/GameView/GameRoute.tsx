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
          header={<Header height={100} sx={otherColors} children={null} />}
          navbar={
            <Navbar width={{ base: 1 }} sx={otherColors} children={null} />
          }
        >
          <GameView />
        </AppShell>
      </GameProvider>
    </SocketProvider>
  );
}
