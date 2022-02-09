import Quizzes from '../quizzes.json';

interface Quiz {
  title: string;
  description: string;
  quizType: string;
  results: any; // eslint-disable-line
  questions: any[]; // eslint-disable-line
}

export default function useGetQuiz(id: number) {
  return (): Quiz => Quizzes[id];
}
