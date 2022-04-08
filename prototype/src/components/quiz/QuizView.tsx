import React, { useState } from 'react';
import { AppShell, Container, Text } from '@mantine/core';
import Quizzes from './../../quizzes.json';
import AppNavbar from './../navbar/AppNavbar';
import AppHeader from './../header/AppHeader';
import Quiz from './Quiz';

interface AppState {
  currentQuiz: number | undefined;
}

export default function QuizView(): JSX.Element {
  const [state, setState] = useState<AppState>({ currentQuiz: undefined });
  const useChangeQuiz = (id: number) => {
    return () => {
      setState({ currentQuiz: id });
    };
  };
  return (
    <AppShell
      padding="md"
      navbar={
        <AppNavbar
          useChangeQuiz={useChangeQuiz}
          quizzes={Quizzes}
          currentQuizId={state.currentQuiz}
        />
      }
      header={<AppHeader />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0]
        }
      })}
    >
      <Container>
        {state.currentQuiz === undefined && <Text>Please select a quiz!</Text>}
        {state.currentQuiz !== undefined && <Quiz id={state.currentQuiz} />}
      </Container>
    </AppShell>
  );
}
