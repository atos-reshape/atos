import { Image, Navbar, ThemeIcon } from '@mantine/core';
import { NavigationButton } from '../../../components/navigation/NavigationButton/NavigationButton';
import { PlayerPlay } from 'tabler-icons-react';

export default function Sidebar() {
  return (
    <Navbar width={{ base: 260 }} p="xs">
      <Navbar.Section className="logo-nav-container">
        <Image className="logo" src={'/Atos_logo_blue_RGB.png'} />
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        <NavigationButton text="Active Games" link="lobbies">
          <ThemeIcon color="blue" variant="light">
            <PlayerPlay size={20} />
          </ThemeIcon>
        </NavigationButton>
      </Navbar.Section>
    </Navbar>
  );
}
