import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { FreeMode } from './pages/FreeMode';
import { BotMode } from './pages/BotMode';
import { OnlineMode } from './pages/OnlineMode';
import { Leaderboard } from './pages/Leaderboard';
import { Footer } from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play/free" element={<FreeMode />} />
          <Route path="/play/bot" element={<BotMode />} />
          <Route path="/play/online" element={<OnlineMode />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;