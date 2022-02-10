import React, { useEffect, useState } from 'react';
import { Grid, Space, Title, Text } from '@mantine/core';
import Card from '../card';
import useGetQuiz from '../../hooks/useGetQuiz';

interface Props {
  id: number;
}

interface State {
  currentQuestion: number;
  previousAnswers: string[];
}

export default function Quiz({ id }: Props): JSX.Element {
  const getQuiz = useGetQuiz(id);
  const [state, setState] = useState<State>({
    currentQuestion: 0,
    previousAnswers: []
  });

  useEffect(() => {
    setState({
      currentQuestion: 0,
      previousAnswers: []
    });
  }, [id]);

  const useSelectCard = (type: string) => {
    return () => {
      setState((p) => {
        const answers = p.previousAnswers;
        answers.push(type);
        return {
          currentQuestion: p.currentQuestion + 1,
          previousAnswers: answers
        };
      });
    };
  };

  const { questions, results } = getQuiz();
  if (questions.length - 1 <= state.currentQuestion) {
    const result = state.previousAnswers.reduce(
      (a, c) => ((a[c] = (a[c] || 0) + 1), a),
      Object.create(null)
    );
    const maxCount = Math.max(
      ...(Object.values(result) as unknown as number[])
    );
    const mostFrequent = Object.keys(result).filter(
      (k) => result[k] === maxCount
    );
    return (
      <>
        <Title>{results[mostFrequent[0]].result}</Title>
        <Space h="xl" />
        <Text>{results[mostFrequent[0]].information}</Text>
      </>
    );
  }

  const question = questions[state.currentQuestion];
  return (
    <>
      <Title>{question.title}</Title>
      <Space h="xl" />
      <Grid columns={8}>
        {question.answers.map(
          (answer: { title: string; type: string }, index: number) => {
            return (
              <Grid.Col span={4} key={index}>
                <Card
                  title={answer.title}
                  buttonText="Select this card"
                  onClick={useSelectCard(answer.type)}
                />
              </Grid.Col>
            );
          }
        )}
      </Grid>
    </>
  );
}
