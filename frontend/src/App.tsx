import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage.tsx';
import CardPage from './pages/CardPage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cards" element={<CardPage />} />
      </Routes>
    </Router>
  );
}
export default App;