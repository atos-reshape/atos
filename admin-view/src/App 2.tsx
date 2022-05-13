import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import AdminView from './pages/Admin/AdminView';

export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminView />} />
      </Routes>
    </Router>
  );
}
