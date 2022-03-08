import React from 'react';
import { Header, Navbar, Title } from '@mantine/core';

export default function AppHeader(): JSX.Element {
  return (
    <Header height={60} padding="xs">
      <Navbar.Section>
        <Title order={2}>Hackathon Prototype</Title>
      </Navbar.Section>
    </Header>
  );
}
