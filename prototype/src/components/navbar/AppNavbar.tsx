import React from 'react';
import { Navbar, Button, Space, Text } from '@mantine/core';

interface Quiz {
  title: string;
  description: string;
  quizType: string;
  results: unknown;
  questions: unknown[];
}

interface Props {
  useChangeQuiz(id: number): () => void;
  quizzes: Quiz[];
  currentQuizId: number | undefined;
}

export default function AppNavbar({
  useChangeQuiz,
  quizzes,
  currentQuizId
}: Props): JSX.Element {
  return (
    <Navbar width={{ base: 300 }} padding="xs">
      <Navbar.Section>
        <Text size="xl" style={{ width: '100%', textAlign: 'center' }}>
          All available quizzes
        </Text>
      </Navbar.Section>
      <Space h="xs" />
      <div>
        {quizzes.map((quiz: Quiz, index: number) => {
          const variant: 'subtle' | 'filled' =
            index !== currentQuizId ? 'subtle' : 'filled';
          return (
            <Navbar.Section key={index}>
              <Button
                variant={variant}
                fullWidth
                onClick={useChangeQuiz(index)}
              >
                {quiz.title}
              </Button>
            </Navbar.Section>
          );
        })}
      </div>
    </Navbar>
  );
}
