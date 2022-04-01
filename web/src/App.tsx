import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { queryClient } from './api/react-query/queryClient';
import { QueryClientProvider } from 'react-query';
import GameSetup from './pages/GameSetup/GameSetup';
import GameView from './pages/GameView/GameView';
import JoinGame from './pages/JoinGame/JoinGame';

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<GameSetup />} />
          <Route path="/game" element={<GameView />} />
          <Route path="/join" element={<JoinGame />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
