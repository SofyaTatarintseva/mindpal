import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EmotionDiaryPage from './pages/EmotionDiaryPage';
import TaskDecomposer from './pages/TaskDecomposer';
const basename = import.meta.env.BASE_URL || '/';
function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emotions" element={<EmotionDiaryPage />} />
        <Route path="/tasks" element={<TaskDecomposer />} />
      </Routes>
    </Router>
  );
}

export default App;