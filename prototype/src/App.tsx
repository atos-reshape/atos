import React, { useState } from 'react';
import { AppShell, Container, Text } from '@mantine/core';
import Quizzes from './quizzes.json';
import AppNavbar from './components/navbar/AppNavbar';
import AppHeader from './components/header/AppHeader';
import Quiz from './components/quiz/Quiz';
import CardInputs from './components/input/Input';
import CardUpdates from './components/update/UpdateCard';
import QuizView from './components/quiz/QuizView';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

interface AppState {
  currentQuiz: number | undefined;
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<QuizView />} />
        <Route path="/cards" element={<CardUpdates />} />
      </Routes>
    </BrowserRouter>
  );
}
