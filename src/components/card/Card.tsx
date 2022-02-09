import React from 'react';
import {
  Card as MantineCard,
  Text,
  Group,
  Button,
  useMantineTheme
} from '@mantine/core';

interface CardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
}

export default function Card({
  title,
  description,
  buttonText,
  onClick
}: CardProps): JSX.Element {
  const theme = useMantineTheme();

  return (
    <div style={{ width: 340, margin: 'auto', padding: '10px' }}>
      <MantineCard shadow={theme.shadows.sm} padding={theme.spacing.sm}>
        <Group
          position="apart"
          style={{
            marginBottom: theme.spacing.md,
            marginTop: theme.spacing.sm
          }}
        >
          <Text weight={500}>{title}</Text>
          <Text>{description}</Text>
        </Group>

        <Button
          variant="light"
          color="blue"
          fullWidth
          style={{ marginTop: theme.spacing.md }}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </MantineCard>
    </div>
  );
}
