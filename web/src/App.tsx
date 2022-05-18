import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { queryClient } from './api/react-query/queryClient';
import { QueryClientProvider } from 'react-query';
import GameSetup from './pages/GameSetup/GameSetup';
import { GameView } from './pages/GameView/GameView';
import { GameRoute } from './pages/GameView/GameRoute';
import JoinGame from './pages/JoinGame/JoinGame';
import IndividualResults from './pages/results/IndividualResults';
import * as Admin from './pages/admin';

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/game" element={<GameRoute />} />
          <Route path="/join" element={<JoinGame />} />
          <Route path="/results" element={<IndividualResults />} />

          <Route path="admin/participate" element={<Admin.GameRoute />} />
          <Route path="admin" element={<Admin.default />}>
            <Route path="create" element={<GameSetup />} />
            <Route path="lobbies" element={<Admin.LobbiesView />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
