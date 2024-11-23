import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import CreateReview from './pages/CreateReview.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<Dashboard />} />
        <Route path="/review" element={<CreateReview />} />
      </Routes>
    </Router>
  );
}
export default App;