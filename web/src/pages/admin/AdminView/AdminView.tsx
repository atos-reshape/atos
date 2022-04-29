import { AppShell, MantineTheme } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AdminView.css';
import { AuthProvider } from '../lib/providers/AuthProvider';

const getStyles = (theme: MantineTheme) => ({
  main: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
  }
});

export function AdminView(): JSX.Element {
  return (
    <AuthProvider>
      <AppShell padding="md" navbar={<Sidebar />} styles={getStyles}>
        <Outlet />
      </AppShell>
    </AuthProvider>
  );
}
