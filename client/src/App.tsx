import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EmotionDiaryPage from './pages/EmotionDiaryPage';
import TaskDecomposer from './pages/TaskDecomposer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emotions" element={<EmotionDiaryPage />} />
        <Route path="/tasks" element={<TaskDecomposer />} />
      </Routes>
    </Router>
  );
}

export default App;