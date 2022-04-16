import { Group, Text, UnstyledButton } from '@mantine/core';
import { Link } from 'react-router-dom';

interface Props {
  link: string;
  text: string;
  children: JSX.Element;
}

export function NavigationButton({ link, text, children }: Props): JSX.Element {
  return (
    <Link to={link}>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0]
          }
        })}
      >
        <Group>
          {children}
          <Text size="md" className="default-link">
            {text}
          </Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
}
