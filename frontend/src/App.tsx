import { Routes, Route } from 'react-router-dom';

import Navigation from 'components/Navigation';
import HomePage from './pages/HomePage';
import VideosPage from './pages/VideosPage';
import VideoPage from 'pages/VideoPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/video/:id" element={<VideoPage />} />
      </Routes>
    </div>
  );
}

export default App;
