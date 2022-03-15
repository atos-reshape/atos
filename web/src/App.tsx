import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameSetup from './pages/GameSetup/GameSetup';

export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameSetup />} />
      </Routes>
    </Router>
  );
}
