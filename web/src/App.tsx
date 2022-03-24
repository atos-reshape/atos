import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { queryClient } from './api/react-query/queryClient';
import { QueryClientProvider } from 'react-query';
import GameSetup from './pages/GameSetup/GameSetup';

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<GameSetup />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
